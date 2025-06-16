package client

import "time"

const (
	writeWait      = 10 * time.Second    // Time allowed to write a message to the peer.
	pongWait       = 30 * time.Second    // Time allowed to read the next pong message from the peer.
	pingPeriod     = (pongWait * 9) / 10 // Send pings to peer with this period. Must be less than pongWait.
	maxMessageSize = 1024 * 1024         // Maximum message size allowed from peer.
	bufferSize     = 56                  // Size of the message buffer.
)
