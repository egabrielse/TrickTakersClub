package client

import "play/app/msg"

func PingHandler(c *ClientWorker, message *msg.Message) {
	pong := msg.NewPongMessage(c.clientID)
	c.sendMessage(pong)
}

func TimeoutHandler(c *ClientWorker, message *msg.Message) {
	c.sendMessage(msg.NewTimeoutMessage())
}
