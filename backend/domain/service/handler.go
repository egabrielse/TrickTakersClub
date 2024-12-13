package service

import (
	"encoding/json"
	"main/domain/game"
	"main/utils"
)

func HandleCreateGameCommand(t *TableService, clientID string, data interface{}) {
	payload := &game.GameSettings{}
	if clientID != t.Table.HostID {
		t.DirectMessage(clientID, MessageType.Error, "only the host can create a game")
	} else if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, MessageType.Error, "invalid settings payload")
	} else {
		t.Game = NewSheepshead([]string{t.Table.HostID}, payload)
		t.Broadcast(MessageType.NewGame, t.Game.GetState())
	}
}

func HandleEndGameCommand(t *TableService, clientID string, data interface{}) {
	if clientID != t.Table.HostID {
		t.DirectMessage(clientID, MessageType.Error, "only the host can end the game")
	} else if t.Game == nil {
		t.DirectMessage(clientID, MessageType.Error, "game has not been initialized")
	} else {
		t.Game = nil
		t.Broadcast(MessageType.GameOver, nil)
	}
}

func HandleSitDownCommand(t *TableService, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(clientID, MessageType.Error, "game has not been initialized")
	} else if err := t.Game.SitDown(clientID); utils.LogOnError(err) {
		t.DirectMessage(clientID, MessageType.Error, err.Error())
	} else {
		t.Broadcast(MessageType.SatDown, clientID)
		if t.Game.InProgress {
			t.Broadcast(MessageType.GameStarted, t.Game.GetState())
			// TODO: deal hands to players
		}
	}
}

func HandleStandUpCommand(t *TableService, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(clientID, MessageType.Error, "game has not been initialized")
	} else if err := t.Game.StandUp(clientID); utils.LogOnError(err) {
		t.DirectMessage(clientID, MessageType.Error, err.Error())
	} else {
		t.Broadcast(MessageType.StoodUp, clientID)
	}
}
