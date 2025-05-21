package socket

import (
	"common/env"
	"net/http"

	"github.com/gorilla/websocket"
)

func NewConnectionUpgrader() *websocket.Upgrader {
	upgrader := &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			// Only allow connections from the specified browser origin
			requestOrigin := r.Header.Get("Origin")
			allowedOrigin := env.GetEnvironmentVariable("BROWSER_ORIGIN")
			return requestOrigin == allowedOrigin
		},
	}
	return upgrader
}
