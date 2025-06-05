package session

import (
	"play/app/msg"
)

func PongHandler(sw *SessionWorker, message *msg.Message) {
	sw.session.KeepAlive(message.SenderID)
}

func EnterHandler(sw *SessionWorker, message *msg.Message) {
	if err := sw.session.Join(message.SenderID); err != nil {
		// If the user cannot join the session, send an error message.
		errorMessage := msg.NewErrorMessage(err.Error())
		sw.sendMessage(errorMessage)
		return
	} else {
		// TODO: On successful join, send welcome message with session details.
	}
}

func LeaveHandler(sw *SessionWorker, message *msg.Message) {
	sw.session.Leave(message.SenderID)
}
