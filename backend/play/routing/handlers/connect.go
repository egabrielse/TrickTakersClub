package handlers

import (
	"common/request"
	"net/http"
	"play/client"
	"play/socket"

	"github.com/julienschmidt/httprouter"
)

func Connect(w http.ResponseWriter, r *http.Request, p httprouter.Params) (int, any) {
	uid := p.ByName("uid")
	sessionId := p.ByName("sessionId")
	// 1. Upgrade the connection to a websocket connection.
	conn, err := socket.NewConnectionUpgrader().Upgrade(w, r, nil)
	if err != nil {
		return http.StatusInternalServerError, err
	}
	// 2. Create a new socket and connect it.
	socket := client.NewClient(uid, sessionId, conn)
	socket.Connect()
	// Return ResponseWriteHandled to indicate response writing is handled
	return request.ResponseWriteHandled, nil
}
