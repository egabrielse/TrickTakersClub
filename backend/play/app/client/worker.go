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
	}
}

// sendMessageOnChannel sends a message on the Redis channel associated with the session.
func (c *ClientWorker) sendMessageOnChannel(message *msg.Message) (int64, error) {
	// Marshal the message into bytes
	if bytes, err := json.Marshal(message); err != nil {
		logrus.Errorf("Client (%s): %v", c.clientID, err)
		return 0, err
	} else if result, err := c.rdb.Publish(context.Background(), c.sessionID, bytes).Result(); err != nil {
		logrus.Errorf("Client (%s): %v", c.clientID, err)
		return 0, err
	} else {
		return result, nil
	}
}

// sendMessageToClient sends a message to the client over the websocket connection.
func (c *ClientWorker) sendMessageToClient(message *msg.Message) error {
	c.conn.SetWriteDeadline(time.Now().Add(writeWait))
	if err := c.conn.WriteJSON(message); err != nil {
		logrus.Errorf("Client (%s): %v", c.clientID, err)
		return err
	}
	return nil
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
		// Send a leave message to the channel.
		c.sendMessageOnChannel(msg.NewLeaveMessage(c.clientID))
		// Cancel the context (thereby stopping writePump).
		c.cancel()
	}()
	// Send an enter message to the channel.
	if _, err := c.sendMessageOnChannel(msg.NewEnterMessage(c.clientID)); err != nil {
		logrus.Errorf("Client (%s): %v", c.clientID, err)
		return
	}
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
			} else if !message.IsRecipient(c.clientID) {
				continue // Ignore messages not meant for the client
			} else {
				// Handle different message types.
				switch message.MessageType {
				case msg.MessageTypePong:
					// Do nothing
				case msg.MessageTypePing:
					// Respond to ping messages with a pong message.
					c.sendMessageOnChannel(msg.NewPongMessage(c.clientID))
				case msg.MessageTypeTimeout:
					// Session timed out, close the connection.
					logrus.Warnf("Client (%s): session timed out", c.clientID)
					c.sendMessageToClient(message)
					// wait 1 second
					time.Sleep(1 * time.Second)
					return
				default:
					// By default most messages are forwarded to the client.
					c.sendMessageToClient(message)
					continue
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
