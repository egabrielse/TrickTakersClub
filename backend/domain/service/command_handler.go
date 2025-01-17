package service

import (
	"encoding/json"
	"fmt"
	"main/domain/game"
	"main/domain/service/msg"
	"main/utils"
)

func HandleUpdateSettingsCommand(t *TableWorker, clientID string, data interface{}) {
	payload := &msg.UpdateSettingsParams{}
	if t.Table.HostID != clientID {
		t.DirectMessage(clientID, msg.DirectType.Error, "only the host can update settings")
	} else if t.Game != nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game already in progress")
	} else if err := json.Unmarshal([]byte(data.(string)), &payload); utils.LogOnError(err) {
		t.DirectMessage(clientID, msg.DirectType.Error, "invalid settings payload")
	} else {
		ok := true    // True if the value of the payload is of the expected type
		var err error // Error message as a result of updating the settings
		if payload.Key == "autoDeal" {
			var value bool
			value, ok = payload.Value.(bool)
			if ok {
				t.GameSettings.SetAutoDeal(value)
			}
		} else if payload.Key == "playerCount" {
			var value int
			value, ok = payload.Value.(int)
			if ok {
				err = t.GameSettings.SetPlayerCount(value)
				// If needed, remove players from the players list
				if err != nil && len(t.SeatedPlayers) > value {
					t.SeatedPlayers = t.SeatedPlayers[:value]
				}
			}
		} else if payload.Key == "callingMethod" {
			var value string
			value, ok := payload.Value.(string)
			if ok {
				err = t.GameSettings.SetCallingMethod(value)
			}
		} else if payload.Key == "noPickResolution" {
			var value string
			value, ok := payload.Value.(string)
			if ok {
				err = t.GameSettings.SetNoPickResolution(value)
			}
		} else if payload.Key == "doubleOnTheBump" {
			var value bool
			value, ok := payload.Value.(bool)
			if ok {
				t.GameSettings.SetDoubleOnTheBump(value)
			}
		} else {
			err = fmt.Errorf("invalid setting")
		}
		// Handle Messaging
		if !ok {
			t.DirectMessage(clientID, msg.DirectType.Error, "invalid setting value")
		} else if err != nil {
			t.DirectMessage(clientID, msg.DirectType.Error, err.Error())
		} else {
			t.Broadcast(msg.BroadcastType.SettingsUpdated, t.GameSettings)
		}
	}
}

func HandleSitDownCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game != nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game already in progress")
	} else if t.GameSettings.PlayerCount == len(t.SeatedPlayers) {
		t.DirectMessage(clientID, msg.DirectType.Error, "table is full")
	} else {
		t.SeatedPlayers = append(t.SeatedPlayers, clientID)
		t.Broadcast(msg.BroadcastType.SatDown, clientID)
	}
}

func HandleStandUpCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Table.HostID == clientID {
		t.DirectMessage(clientID, msg.DirectType.Error, "host cannot stand up")
	} else if t.Game != nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game already in progress")
	} else if t.GameSettings.PlayerCount == len(t.SeatedPlayers) {
		t.DirectMessage(clientID, msg.DirectType.Error, "table is full")
	} else if !utils.Contains(t.SeatedPlayers, clientID) {
		t.DirectMessage(clientID, msg.DirectType.Error, "not a player")
	} else {
		t.SeatedPlayers = utils.Filter(t.SeatedPlayers, func(v string) bool {
			return v != clientID
		})
		t.Broadcast(msg.BroadcastType.StoodUp, clientID)
	}
}

func HandleStartGameCommand(t *TableWorker, clientID string, data interface{}) {
	if clientID != t.Table.HostID {
		t.DirectMessage(clientID, msg.DirectType.Error, "only the host can start the game")
	} else if t.Game != nil {
		t.DirectMessage(clientID, msg.DirectType.Error, "game already in progress")
	} else if len(t.SeatedPlayers) != t.GameSettings.PlayerCount {
		t.DirectMessage(clientID, msg.DirectType.Error, "not enough players")
	} else {
		// Start a new game
		t.Game = game.NewGame(t.SeatedPlayers, t.GameSettings)
		// Reset Players for the next game
		t.SeatedPlayers = []string{t.Table.HostID}
		// Start a new hand
		t.Game.StartNewHand()
		// Announce the start of the game
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
