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
		t.Game = game.NewSheepshead([]string{t.Table.HostID}, payload)
		payload := &NewGamePayload{
			Settings:    t.Game.Settings,
			PlayerOrder: t.Game.PlayerOrder,
		}
		t.Broadcast(MessageType.NewGame, payload)
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
		if t.Game.HandInProgress() {
			t.Broadcast(MessageType.GameStarted, &GameStartedPayload{
				Scoreboard:  t.Game.Scoreboard,
				PlayerOrder: t.Game.PlayerOrder,
			})
			for _, playerID := range t.Game.PlayerOrder {
				t.DirectMessage(playerID, MessageType.DealHand, &DealHandPayload{
					DealerID: t.Game.PlayerOrder[t.Game.DealerIndex],
					Cards:    t.Game.Hand.Players[playerID].Hand,
				})
			}
			t.Broadcast(MessageType.UpNext, &UpNextPayload{
				PlayerID: t.Game.Hand.WhoIsNext(),
				Phase:    t.Game.Hand.Phase,
			})
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

func HandlePickPassCommand(t *TableService, clientID string, data interface{}) {
	params := &PickPassParams{}
	if t.Game == nil {
		t.DirectMessage(clientID, MessageType.Error, "game has not been initialized")
	} else if t.Game.Hand.WhoIsNext() != clientID {
		t.DirectMessage(clientID, MessageType.Error, "not your turn")
	} else if err := json.Unmarshal([]byte(data.(string)), &params); utils.LogOnError(err) {
		t.DirectMessage(clientID, MessageType.Error, "")
	}
}
