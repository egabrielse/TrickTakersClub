package socket

import (
	"common/env"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

func NewConnectionUpgrader() *websocket.Upgrader {
	upgrader := &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			logrus.Infof("WebSocket connection from %s", r.Header.Get("Origin"))
			requestOrigin := r.Header.Get("Origin")
			allowedOrigin := env.GetEnvironmentVariable("ALLOWED_ORIGIN")
			return requestOrigin == allowedOrigin
		},
	}
	return upgrader
}
