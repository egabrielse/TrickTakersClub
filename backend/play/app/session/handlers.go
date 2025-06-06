package session

import (
	"play/app/msg"

	"github.com/sirupsen/logrus"
)

func PongHandler(sw *SessionWorker, message *msg.Message) {
	sw.session.KeepAlive(message.SenderID)
}

func EnterHandler(sw *SessionWorker, message *msg.Message) {
	logrus.Infof("Session (%s): %s enter message received", sw.session.ID, message.SenderID)
	if err := sw.session.Join(message.SenderID); err != nil {
		// If the user cannot join the session, inform them with an error message.
		sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		return
	} else {
		// Send a welcome message to the new player.
		logrus.Infof("Session (%s): sending welcome message to %s", sw.session.ID, message.SenderID)
		sw.sendMessage(message.SenderID, msg.NewWelcomeMessage(
			message.SenderID,
			sw.session.HostID,
			sw.session.ID,
			sw.session.ListPresence(),
			sw.session.GameSettings,
			sw.session.Game,
		))
		logrus.Infof("Session (%s): %s has joined the session", sw.session.ID, message.SenderID)
		enterMsg := msg.NewEnteredMessage(message.SenderID)
		// Notify all clients of new player joining the session.
		sw.broadcastMessage(enterMsg)
	}
}

func LeaveHandler(sw *SessionWorker, message *msg.Message) {
	sw.session.Leave(message.SenderID)
	// Notify all clients that a player has left the session.
	sw.broadcastMessage(msg.NewLeftMessage(message.SenderID))
}
