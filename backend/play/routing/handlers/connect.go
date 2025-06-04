package handlers

import (
	"common/request"
	"net/http"
	"play/app/client"
	"play/socket"
	"storage/repository"

	"github.com/julienschmidt/httprouter"
)

func Connect(w http.ResponseWriter, r *http.Request, p httprouter.Params) (int, any) {
	// Extract the user ID and session ID from the request parameters.
	uid := p.ByName("uid")
	sessionID := p.ByName("sessionId")
	// Check if the session exists in redis.
	sessionRepo := repository.GetSessionRepo()
	if exists, err := sessionRepo.Exists(r.Context(), sessionID); err != nil {
		return http.StatusInternalServerError, err
	} else if !exists {
		return http.StatusNotFound, nil
	} else {
		// Upgrade the connection to a websocket connection.
		conn, err := socket.NewConnectionUpgrader().Upgrade(w, r, nil)
		if err != nil {
			return http.StatusInternalServerError, err
		}
		// Create a new socket and connect it.
		socket := client.NewClient(uid, sessionID, conn)
		socket.Connect()
		// Return ResponseWriteHandled to indicate response writing is handled
		return request.ResponseWriteHandled, nil
	}
}
