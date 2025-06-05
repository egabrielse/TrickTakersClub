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

func (c *ClientWorker) sendMessage(message *msg.Message) (int64, error) {
	// Marshal the message into bytes
	if bytes, err := message.MarshalBinary(); err != nil {
		logrus.Errorf("ClientWorker error marshalling message: %v", err)
		return 0, err
	} else if result, err := c.rdb.Publish(context.Background(), c.sessionID, bytes).Result(); err != nil {
		logrus.Errorf("ClientWorker error sending message on channel %s: %v", c.sessionID, err)
		return 0, err
	} else {
		return result, nil
	}
}

func (c *ClientWorker) StartWorker() {
	// Configure connection settings.
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetPongHandler(c.pongHandler)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetWriteDeadline(time.Now().Add(writeWait))
	// Start the message pumps.
	go c.readPump()
	go c.writePump()
}

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
		logrus.Infof("Client: closing readPump")
		// Send a leave message to the channel.
		c.sendMessage(msg.NewLeaveMessage(c.clientID))
		// Cancel the context (thereby stopping writePump).
		c.cancel()
	}()
	// Send an enter message to the channel.
	if _, err := c.sendMessage(msg.NewEnterMessage(c.clientID)); err != nil {
		logrus.Errorf("Client: error sending enter message: %v", err)
		return
	}
	for {
		var message *msg.Message
		if _, rawMsg, err := c.conn.ReadMessage(); err != nil {
			logrus.Errorf("Client: Read Error: %v", err)
			return
		} else if err = json.Unmarshal(rawMsg, &message); err != nil {
			logrus.Errorf("Client: Unmarshal Error: %v", err)
			continue
		} else if result, err := c.sendMessage(message); err != nil {
			logrus.Errorf("Client: error sending message on channel %s: %v", c.sessionID, err)
			return
		} else {
			logrus.Infof("Client: Published message to channel %s: %d", c.sessionID, result)
		}
	}
}

// writePump writes messages to the websocket connection and handles ping/pong.
func (c *ClientWorker) writePump() {
	channel := c.rdb.Subscribe(c.ctx, c.sessionID)
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		// Write Pump is closing. Perform cleanup.
		logrus.Infof("Client: closing writePump")
		// Stop the ticker.
		ticker.Stop()
		// Close the socket (thereby stopping readPump).
		c.conn.Close()
	}()
	for {
		select {
		case <-c.ctx.Done():
			return

		case redisMessage := <-channel.Channel():
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			var message *msg.Message
			if err := json.Unmarshal([]byte(redisMessage.Payload), &message); err != nil {
				logrus.Errorf("Connection: error unmarshalling redis message payload: %v", err)
				continue
			} else if !message.IsBroadcast() && message.ReceiverID != msg.AppID {
				continue // Ignore messages not meant for the client
			} else {
				switch message.MessageType {
				case msg.MessageTypePong:
					// Do nothing
				case msg.MessageTypePing:
					pong := msg.NewPongMessage(c.clientID)
					c.sendMessage(pong)
				case msg.MessageTypeTimeout:
					// Session timed out, close the connection.
					logrus.Error("Client: Session Timed Out")
					return
				default:
					// Most messages are forwarded to the client.
					if err := c.conn.WriteJSON(message); err != nil {
						logrus.Errorf("Client: Error Writing Message: %v", err)
						return
					}
					continue
				}
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				logrus.Errorf("Client: Error Pinging ClientWorker")
				return
			}
		}
	}
}
