package client

import (
	"context"
	"encoding/json"
	"play/app/msg"
	"time"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

type Client struct {
	clientID  string
	sessionID string
	conn      *websocket.Conn
	ctx       context.Context
	cancel    context.CancelFunc
	msgChan   chan *msg.Message
}

func NewClient(clientID string, sessionID string, conn *websocket.Conn) *Client {
	ctx, cancel := context.WithCancel(context.Background())
	return &Client{
		clientID:  clientID,
		sessionID: sessionID,
		conn:      conn,
		ctx:       ctx,
		cancel:    cancel,
		msgChan:   make(chan *msg.Message, bufferSize),
	}
}

func (c *Client) Connect() error {
	// Configure connection settings.
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetPongHandler(c.pongHandler)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetWriteDeadline(time.Now().Add(writeWait))
	// Start the message pumps.
	go c.readPump()
	go c.writePump()
	return nil
}

func (c *Client) pongHandler(string) error {
	// Reset the read deadline to the current time plus the pong wait time after receiving a pong.
	if err := c.conn.SetReadDeadline(time.Now().Add(pongWait)); err != nil {
		return err
	}
	return nil
}

// readPump reads messages from the websocket connection and handles them.
func (c *Client) readPump() {
	defer func() {
		// Read Pump is closing. Perform cleanup.
		logrus.Infof("Client: closing readPump")
		// Cancel the context (thereby stopping writePump).
		c.cancel()
	}()
	for {
		var message *msg.Message
		if _, rawMsg, err := c.conn.ReadMessage(); err != nil {
			logrus.Errorf("Client: Read Error: %v", err)
			return
		} else if err = json.Unmarshal(rawMsg, &message); err != nil {
			logrus.Errorf("Client: Unmarshal Error: %v", err)
			continue
		} else {
			logrus.Infof("Client: Received message: %s", string(rawMsg))
			// For now simply push the message to the channel to be sent back.
			c.msgChan <- message
		}
	}
}

// writePump writes messages to the websocket connection and handles ping/pong.
func (c *Client) writePump() {
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

		case message, ok := <-c.msgChan:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				logrus.Info("Client: Closing Due to Inactivity")
				c.conn.WriteMessage(websocket.CloseMessage, []byte("Closed due to inactivity"))
				return
			} else if message.IsBroadcast() && message.ReceiverID != c.clientID {
				logrus.Infof("Client: Ignoring Message for Another Client: %s", message.ReceiverID)
				continue
			} else if err := c.conn.WriteJSON(message); err != nil {
				logrus.Errorf("Client: Error Writing Message: %v", err)
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				logrus.Errorf("Client: Error Pinging Client")
				return
			}
		}
	}
}
