package handlers

import (
	"net/http"
	"play/socket"

	"github.com/julienschmidt/httprouter"
	"github.com/sirupsen/logrus"
)

func Connect(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	uid := p.ByName("uid")
	sessionId := p.ByName("sessionId")
	// 1. Upgrade the connection to a websocket connection.
	if conn, err := socket.NewConnectionUpgrader().Upgrade(w, r, nil); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	} else {
		logrus.Info("Connection upgraded successfully")
		logrus.Infof("User %s connected to session %s", uid, sessionId)
		defer conn.Close()
	}
}
