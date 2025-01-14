package service

import (
	"encoding/json"
	"main/domain/game"
	"main/domain/service/msg"
	"main/utils"
)

func HandleCreateGameCommand(t *TableService, clientID string, data interface{}) {
	payload := &game.GameSettings{}
	if clientID != t.Table.HostID {
		t.DirectMessage(clientID, msg.DirectType.Error, "only the host can create a game")
	} else if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else {
		t.Game = game.NewGame([]string{t.Table.HostID}, payload)
		payload := &msg.NewGamePayload{
			Settings:    t.Game.Settings,
			PlayerOrder: t.Game.PlayerOrder,
		}
		t.Broadcast(msg.BroadcastType.NewGame, payload)
	}
}

func HandleEndGameCommand(t *TableService, clientID string, data interface{}) {
	if clientID != t.Table.HostID {
		t.DirectMessage(clientID, msg.DirectType.Error, "only the host can end the game")
	} else if t.Game == nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game has not been initialized")
	} else {
		t.Game = nil
		t.Broadcast(msg.BroadcastType.GameOver, nil)
	}
}

func HandleSitDownCommand(t *TableService, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game has not been initialized")
	} else if err := t.Game.SitDown(clientID); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		t.Broadcast(msg.BroadcastType.SatDown, clientID)
		if t.Game.HandInProgress() {
			t.Broadcast(msg.BroadcastType.GameStarted, &msg.GameStartedPayload{
				Scoreboard:  t.Game.Scoreboard,
				PlayerOrder: t.Game.PlayerOrder,
			})
			for _, playerID := range t.Game.PlayerOrder {
				t.DirectMessage(playerID, msg.DirectType.DealHand, &msg.DealHandPayload{
					DealerID: t.Game.PlayerOrder[t.Game.DealerIndex],
					Cards:    t.Game.Hand.Players[playerID].Hand,
				})
			}
			t.Broadcast(msg.BroadcastType.UpNext, t.Game.GetUpNext())
		}
	}
}

func HandleStandUpCommand(t *TableService, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game has not been initialized")
	} else if err := t.Game.StandUp(clientID); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		t.Broadcast(msg.BroadcastType.StoodUp, clientID)
	}
}

func HandlePickCommand(t *TableService, clientID string, data interface{}) {
	// TODO: Implement
}

func HandlePassCommand(t *TableService, clientID string, data interface{}) {
	// TODO: Implement
}

func HandleBuryCommand(t *TableService, clientID string, data interface{}) {
	payload := &msg.BuryCommandParams{}
	if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else {
		// TODO: Implement
	}
}

func HandleCallCommand(t *TableService, clientID string, data interface{}) {
	payload := &msg.CallCommandParams{}
	if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else {
		// TODO: Implement
	}
}

func HandlePlayCardCommand(t *TableService, clientID string, data interface{}) {
	payload := &msg.PlayCardCommandParams{}
	if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else {
		// TODO: Implement
	}
}
