package handlers

import (
	"common/clients"
	"common/request"
	"net/http"
	"play/app/client"
	"play/socket"

	"github.com/julienschmidt/httprouter"
)

func Connect(w http.ResponseWriter, r *http.Request, p httprouter.Params) (int, any) {
	// Extract the user ID and session ID from the request parameters.
	uid := p.ByName("uid")
	sessionID := p.ByName("sessionId")
	// Upgrade the connection to a websocket connection.
	conn, err := socket.NewConnectionUpgrader().Upgrade(w, r, nil)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	rdb := clients.GetRedisClient()
	// Create a new socket and connect it.
	client := client.NewClientWorker(uid, sessionID, rdb, conn)
	client.StartWorker()
	// Return ResponseWriteHandled to indicate response writing is handled
	return request.ResponseWriteHandled, nil
}
