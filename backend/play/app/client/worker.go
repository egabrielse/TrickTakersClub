package client

import (
	"context"
	"encoding/json"
	"play/app/msg"
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
	// Start the message pumps.
	go c.readPump()
	go c.writePump()
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
			logrus.Errorf("Client (%s): %v", c.clientID, err)
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
	defer func() {
		// Write Pump is closing. Perform cleanup.
		logrus.Infof("Client (%s): closing writePump", c.clientID)
		// Stop the ticker.
		ticker.Stop()
		// Close the socket (thereby stopping readPump).
		c.conn.Close()
		// Send a leave message to the channel.
		c.messageSessionWorker(msg.NewLeaveMessage())
		// Unsubscribe from the Redis channel.
		channel.Unsubscribe(c.ctx, c.sessionID)
	}()

	for {
		select {
		case <-c.ctx.Done():
			return

		case redisMessage := <-channel.Channel():
			var message *msg.Message
			if err := json.Unmarshal([]byte(redisMessage.Payload), &message); err != nil {
				logrus.Errorf("Client (%s): %v", c.clientID, err)
				continue
			} else if message.IsSender(c.clientID) {
				continue // Ignore messages sent by the client itself.
			} else if !message.IsRecipient(c.clientID) {
				continue // Ignore messages not meant for the client
			} else if !c.connected {
				// Until the client is connected, only handle welcome and ping messages.
				if message.MessageType == msg.MessageTypePing {
					// Request to enter the session.
					logrus.Infof("Client (%s): ping message received, sending enter message", c.clientID)
					c.messageSessionWorker(msg.NewEnterMessage())
				} else if message.MessageType == msg.MessageTypeWelcome {
					// Session worker has sent a welcome message.
					logrus.Infof("Client (%s): welcome message received", c.clientID)
					c.connected = true
					c.forwardToClient(message)
				}
			} else {
				// Handle different message types.
				switch message.MessageType {
				case msg.MessageTypePing:
					// Respond to ping messages with a pong message.
					c.messageSessionWorker(msg.NewPongMessage())
				case msg.MessageTypePong:
					// Do nothing
				case msg.MessageTypeTimeout:
					// Session timed out, close the connection.
					logrus.Warnf("Client (%s): session timed out", c.clientID)
					c.forwardToClient(message)
					// wait 1 second
					time.Sleep(1 * time.Second)
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
