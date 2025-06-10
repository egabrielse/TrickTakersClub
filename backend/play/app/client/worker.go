package client

import (
	"context"
	"encoding/json"
	"play/app/msg"
	"storage/repository"
	"time"

	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
)

type ClientWorker struct {
	clientID  string
	sessionID string
	conn      *websocket.Conn
	rdb       *redis.Client
	ctx       context.Context
	cancel    context.CancelFunc
	connected bool
}

func NewClientWorker(clientID string, sessionID string, rdb *redis.Client, conn *websocket.Conn) *ClientWorker {
	ctx, cancel := context.WithCancel(context.Background())
	return &ClientWorker{
		clientID:  clientID,
		sessionID: sessionID,
		conn:      conn,
		rdb:       rdb,
		ctx:       ctx,
		cancel:    cancel,
		connected: false,
	}
}

// sendMessageOnChannel sends a message over the Redis channel associated with the session.
func (c *ClientWorker) sendMessageOnChannel(message *msg.Message) (int64, error) {
	// Marshal the message into bytes
	if bytes, err := json.Marshal(message); err != nil {
		logrus.Errorf("Client (%s): %v", c.clientID, err)
		return 0, err
	} else if result, err := c.rdb.Publish(context.Background(), c.sessionID, bytes).Result(); err != nil {
		logrus.Errorf("Client (%s): %v", c.clientID, err)
		return 0, err
	} else {
		logrus.Infof("Client (%s): message of type %s received by %d", c.clientID, message.MessageType, result)
		return result, nil
	}
}

// messageSessionWorker sends a message to the session worker over the Redis channel.
// It sets the sender ID to the client ID and the receiver ID to the session worker ID.
func (c *ClientWorker) messageSessionWorker(message *msg.Message) (int64, error) {
	// Set the sender ID and receiver ID for the message
	message.SetSenderID(c.clientID)
	message.SetReceiverID(msg.SessionWorkerID)
	return c.sendMessageOnChannel(message)
}

// sendCloseMessage sends a close message to the client and closes the connection.
func (c *ClientWorker) sendCloseMessage(reason string) {
	logrus.Infof("Client (%s): closing connection: %s", c.clientID, reason)
	// Send a close frame
	c.conn.WriteControl(
		websocket.CloseMessage,
		websocket.FormatCloseMessage(websocket.CloseNormalClosure, reason),
		time.Now().Add(time.Second),
	)
	// Wait for the handshake to complete
	time.Sleep(100 * time.Millisecond)
	// Close the connection
	c.conn.Close()
}

// forwardToClient forwards a message received from the redis channel to the client via the websocket connection.
func (c *ClientWorker) forwardToClient(message *msg.Message) {
	c.conn.SetWriteDeadline(time.Now().Add(writeWait))
	c.conn.WriteJSON(message)
}

// StartWorker configures the websocket connection and starts the read and write pumps.
func (c *ClientWorker) StartWorker() {
	logrus.Infof("Client (%s): starting up...", c.clientID)
	// Configure connection settings.
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetPongHandler(c.pongHandler)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetWriteDeadline(time.Now().Add(writeWait))

	// Check if the session exists in the repository.
	sessionRepo := repository.GetSessionRepo()
	if exists, err := sessionRepo.Exists(c.ctx, c.sessionID); err != nil || !exists {
		// Session does not exist or an error occurred.
		c.sendCloseMessage("Session not found")
	} else {
		// Start the message pumps.
		go c.readPump()
		go c.writePump()
	}
}

// pongHandler resets the read deadline when a pong message is received from the client.
// Note: this is not to be confused with the ping/pong mechanism used to keep the connection alive.
func (c *ClientWorker) pongHandler(string) error {
	// Reset the read deadline to the current time plus the pong wait time after receiving a pong.
	if err := c.conn.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
		return err
	}
	return nil
}

// readPump reads messages from the websocket connection and handles them.
func (c *ClientWorker) readPump() {
	defer func() {
		// Read Pump is closing. Perform cleanup.
		logrus.Infof("Client (%s): closing readPump", c.clientID)
		// Cancel the context (thereby stopping writePump).
		c.cancel()
	}()
	for {
		var message *msg.Message
		if _, rawMsg, err := c.conn.ReadMessage(); err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure) {
				logrus.Infof("Client (%s): connection closed normally", c.clientID)
			} else {
				logrus.Errorf("Client (%s): unexpected close error: %v", c.clientID, err)
			}
			return
		} else if err = json.Unmarshal(rawMsg, &message); err != nil {
			logrus.Errorf("Client (%s): %v", c.clientID, err)
			continue
		} else if result, err := c.sendMessageOnChannel(message); err != nil {
			logrus.Errorf("Client (%s): %v", c.clientID, err)
			return
		} else {
			logrus.Infof("Client (%s): message published to %s received by %d", c.clientID, c.sessionID, result)
		}
	}
}

// writePump writes messages to the websocket connection from the Redis channel and handles pings.
func (c *ClientWorker) writePump() {
	channel := c.rdb.Subscribe(c.ctx, c.sessionID)
	ticker := time.NewTicker(pingPeriod)
	connectionTimer := time.NewTimer(10 * time.Second)
	defer func() {
		// Write Pump is closing. Perform cleanup.
		logrus.Infof("Client (%s): closing writePump", c.clientID)
		// Stop the ticker.
		ticker.Stop()
		// Send a leave message to the channel.
		c.messageSessionWorker(msg.NewLeaveMessage())
		// Unsubscribe from the Redis channel.
		channel.Unsubscribe(c.ctx, c.sessionID)
	}()

	// Send initial enter request message
	c.messageSessionWorker(msg.NewEnterMessage())

	for {
		select {
		case <-c.ctx.Done():
			// readPump has closed the context, so we should stop writing.
			return

		case <-connectionTimer.C:
			// If after 10 seconds the client is not connected to the session, close the connection.
			if !c.connected {
				logrus.Infof("Client (%s): connection timed out, closing connection", c.clientID)
				c.sendCloseMessage("Connection timed out, please try again.")
				return
			}

		case redisMessage := <-channel.Channel():
			var message *msg.Message
			if err := json.Unmarshal([]byte(redisMessage.Payload), &message); err != nil {
				logrus.Errorf("Client (%s): %v", c.clientID, err)
				continue
			} else if message.IsSender(c.clientID) && message.MessageType != msg.MessageTypeChat {
				continue // Ignore messages sent by the client itself (except chat messages)
			} else if !message.IsRecipient(c.clientID) {
				continue // Ignore messages not meant for the client
			} else if !c.connected {
				// CONNECTION LOGIC
				// Until the client is connected, only handle welcome and ping messages.
				switch message.MessageType {
				case msg.MessageTypePing:
					// Request to enter the session.
					logrus.Infof("Client (%s): ping message received, sending enter message", c.clientID)
					c.messageSessionWorker(msg.NewEnterMessage())
				case msg.MessageTypeWelcome:
					// Session worker has sent a welcome message.
					logrus.Infof("Client (%s): welcome message received", c.clientID)
					c.connected = true
					c.forwardToClient(message)
				case msg.MessageTypeSessionFull:
					// Session is full, end the connection with a close message.
					c.sendCloseMessage("Session is full and is closed to new players.")
					return
				}

			} else {
				// CONNECTED LOGIC
				// Once connected to the session, begin handling all messages.
				switch message.MessageType {
				case msg.MessageTypePing:
					// Respond to ping messages with a pong message.
					c.messageSessionWorker(msg.NewPongMessage())
				case msg.MessageTypePong:
					// Do nothing
				case msg.MessageTypeTimeout:
					// End connection to client if the session has timed out.
					c.sendCloseMessage("Session timed out due to inactivity.")
					return
				default:
					// By default most messages are forwarded to the client.
					c.forwardToClient(message)
				}
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				logrus.Errorf("Client (%s): %v", c.clientID, err)
				return
			}
		}
	}
}
