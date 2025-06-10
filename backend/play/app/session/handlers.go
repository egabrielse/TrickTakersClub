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

func UpdateCallingMethodHandler(sw *SessionWorker, message *msg.Message) {
	logrus.Infof("Session (%s): %s updated calling method", sw.session.ID, message.SenderID)
	if err := sw.session.GameSettings.UpdateCallingMethod(message.Payload.CallingMethod); err != nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		return
	}
	sw.broadcastMessage(msg.NewSettingsUpdatedMessage(sw.session.GameSettings))
}

func UpdateNoPickResolution(sw *SessionWorker, message *msg.Message) {
	if sw.session.HostID != message.SenderID {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("only the host can update settings"))
	} else if sw.session.Game != nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game already in progress"))
	} else if params, err := msg.ExtractParams[msg.UpdateNoPickResolutionParams](message.Payload); logging.LogOnError(err) {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("invalid settings payload"))
	} else {
		if err := sw.session.GameSettings.SetNoPickResolution(params.NoPickResolution); err != nil {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			sw.broadcastMessage(msg.NewSettingsUpdatedMessage(sw.session.GameSettings))
		}
	}
}

func HandleUpdateDoubleOnTheBump(t *TableWorker, clientID string, data interface{}) {
	if t.Table.HostID != clientID {
		t.DirectMessage(msg.ErrorMessage(clientID, "only the host can update settings"))
	} else if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if params, err := msg.ExtractParams[msg.UpdateDoubleOnTheBumpParams](data); logging.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		t.GameSettings.SetDoubleOnTheBump(params.DoubleOnTheBump)
		t.BroadcastMessage(msg.SettingsUpdatedMessage(t.GameSettings))
	}
}
