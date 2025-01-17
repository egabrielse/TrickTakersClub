package service

import (
	"encoding/json"
	"main/domain/game"
	"main/domain/service/msg"
	"main/utils"
)

func HandleCreateGameCommand(t *TableWorker, clientID string, data interface{}) {
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

func HandleEndGameCommand(t *TableWorker, clientID string, data interface{}) {
	if clientID != t.Table.HostID {
		t.DirectMessage(clientID, msg.DirectType.Error, "only the host can end the game")
	} else if t.Game == nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game has not been initialized")
	} else {
		t.Game = nil
		t.Broadcast(msg.BroadcastType.GameOver, nil)
	}
}

func HandleSitDownCommand(t *TableWorker, clientID string, data interface{}) {
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
					DealerID: t.Game.WhoIsDealer(),
					Cards:    t.Game.Players.GetHand(playerID),
				})
			}
			t.Broadcast(msg.BroadcastType.UpNext, t.Game.GetUpNext())
		}
	}
}

func HandleStandUpCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game has not been initialized")
	} else if err := t.Game.StandUp(clientID); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		t.Broadcast(msg.BroadcastType.StoodUp, clientID)
	}
}

func HandlePickCommand(t *TableWorker, clientID string, data interface{}) {
	if !t.Game.HandInProgress() {
		t.DirectMessage(clientID, msg.DirectType.Error, "hand not in progress")
	} else if result, err := t.Game.Pick(clientID); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		t.Broadcast(msg.BroadcastType.BlindPicked, &msg.BlindPickedPayload{PlayerID: result.PickerID})
		t.DirectMessage(result.PickerID, msg.DirectType.PickedCards, &msg.PickedCardsPayload{Cards: result.Blind})
		t.Broadcast(msg.BroadcastType.UpNext, t.Game.GetUpNext())
	}
}

func HandlePassCommand(t *TableWorker, clientID string, data interface{}) {
	if !t.Game.HandInProgress() {
		t.DirectMessage(clientID, msg.DirectType.Error, "hand not in progress")
	} else if result, err := t.Game.Pass(clientID); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		if result != nil {
			t.Broadcast(msg.BroadcastType.BlindPicked, &msg.BlindPickedPayload{PlayerID: result.PickerID})
			t.DirectMessage(result.PickerID, msg.DirectType.PickedCards, &msg.PickedCardsPayload{Cards: result.Blind})
		}
		t.Broadcast(msg.BroadcastType.UpNext, t.Game.GetUpNext())
	}
}

func HandleBuryCommand(t *TableWorker, clientID string, data interface{}) {
	payload := &msg.BuryCommandParams{}
	if !t.Game.HandInProgress() {
		t.DirectMessage(clientID, msg.DirectType.Error, "hand not in progress")
	} else if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else if result, err := t.Game.BuryCards(clientID, payload.Cards); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		t.DirectMessage(clientID, msg.DirectType.BuriedCards, &msg.BuriedCardsPayload{Cards: result.Bury})
		t.Broadcast(msg.BroadcastType.UpNext, t.Game.GetUpNext())
	}
}

func HandleCallCommand(t *TableWorker, clientID string, data interface{}) {
	payload := &msg.CallCommandParams{}
	if !t.Game.HandInProgress() {
		t.DirectMessage(clientID, msg.DirectType.Error, "hand not in progress")
	} else if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else if result, err := t.Game.CallPartner(clientID, payload.Card); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		t.Broadcast(msg.BroadcastType.CalledCard, &msg.CalledCardPayload{Card: result.CalledCard})
		t.Broadcast(msg.BroadcastType.UpNext, t.Game.GetUpNext())
	}
}

func HandleGoAloneCommand(t *TableWorker, clientID string, data interface{}) {
	payload := &msg.CallCommandParams{}
	if !t.Game.HandInProgress() {
		t.DirectMessage(clientID, msg.DirectType.Error, "hand not in progress")
	} else if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else if _, err := t.Game.GoAlone(clientID); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		t.Broadcast(msg.BroadcastType.GoAlone, nil)
		t.Broadcast(msg.BroadcastType.UpNext, t.Game.GetUpNext())
	}
}

func HandlePlayCardCommand(t *TableWorker, clientID string, data interface{}) {
	payload := &msg.PlayCardCommandParams{}
	if !t.Game.HandInProgress() {
		t.DirectMessage(clientID, msg.DirectType.Error, "hand not in progress")
	} else if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else if result, err := t.Game.PlayCard(clientID, payload.Card); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
	} else {
		t.Broadcast(msg.BroadcastType.CardPlayed, &msg.CardPlayedPayload{Card: result.PlayedCard})
		t.Broadcast(msg.BroadcastType.UpNext, t.Game.GetUpNext())
		if result.PartnerID != "" {
			t.Broadcast(msg.BroadcastType.PartnerRevealed, &msg.PartnerRevealedPayload{PartnerID: result.PartnerID})
		}
		if result.TrickSummary != nil {
			t.Broadcast(msg.BroadcastType.TrickDone, result.TrickSummary)
			if result.HandSummary != nil {
				t.Broadcast(msg.BroadcastType.HandDone, result.HandSummary)
			}
		}
	}
}
