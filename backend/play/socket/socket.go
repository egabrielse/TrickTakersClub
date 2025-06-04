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
			requestOrigin := r.Header.Get("Origin")
			allowedOrigin := env.GetEnvVar("ALLOWED_ORIGIN")
			logrus.Infof("Allowed: %s, Request: %s", allowedOrigin, requestOrigin)
			return requestOrigin == allowedOrigin
		},
	}
	return upgrader
}
