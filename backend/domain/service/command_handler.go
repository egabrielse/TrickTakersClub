package service

import (
	"main/domain/game"
	"main/domain/service/msg"
	"main/utils"
)

func HandleUpdateAutoDeal(t *TableWorker, clientID string, data interface{}) {
	if t.Table.HostID != clientID {
		t.DirectMessage(msg.ErrorMessage(clientID, "only the host can update settings"))
	} else if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if params, err := msg.ExtractParams[msg.UpdateAutoDealParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid setting value"))
	} else {
		t.GameSettings.SetAutoDeal(params.AutoDeal)
		t.BroadcastMessage(msg.SettingsUpdatedMessage(t.GameSettings))
	}
}

func HandleUpdateCallingMethod(t *TableWorker, clientID string, data interface{}) {
	if t.Table.HostID != clientID {
		t.DirectMessage(msg.ErrorMessage(clientID, "only the host can update settings"))
	} else if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if params, err := msg.ExtractParams[msg.UpdateCallingMethodParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		if err := t.GameSettings.SetCallingMethod(params.CallingMethod); err != nil {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			t.BroadcastMessage(msg.SettingsUpdatedMessage(t.GameSettings))
		}
	}
}

func HandleUpdateNoPickResolution(t *TableWorker, clientID string, data interface{}) {
	if t.Table.HostID != clientID {
		t.DirectMessage(msg.ErrorMessage(clientID, "only the host can update settings"))
	} else if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if params, err := msg.ExtractParams[msg.UpdateNoPickResolutionParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		if err := t.GameSettings.SetNoPickResolution(params.NoPickResolution); err != nil {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			t.BroadcastMessage(msg.SettingsUpdatedMessage(t.GameSettings))
		}
	}
}

func HandleUpdateDoubleOnTheBump(t *TableWorker, clientID string, data interface{}) {
	if t.Table.HostID != clientID {
		t.DirectMessage(msg.ErrorMessage(clientID, "only the host can update settings"))
	} else if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if params, err := msg.ExtractParams[msg.UpdateDoubleOnTheBumpParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		t.GameSettings.SetDoubleOnTheBump(params.DoubleOnTheBump)
		t.BroadcastMessage(msg.SettingsUpdatedMessage(t.GameSettings))
	}
}

func HandleSitDownCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if len(t.SeatedPlayers) == game.PlayerCount {
		t.DirectMessage(msg.ErrorMessage(clientID, "table is full"))
	} else {
		t.SeatedPlayers = append(t.SeatedPlayers, clientID)
		t.BroadcastMessage(msg.SatDownMessage(clientID))
	}
}

func HandleStandUpCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Table.HostID == clientID {
		t.DirectMessage(msg.ErrorMessage(clientID, "host cannot stand up"))
	} else if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if !utils.Contains(t.SeatedPlayers, clientID) {
		t.DirectMessage(msg.ErrorMessage(clientID, "not a player"))
	} else {
		t.SeatedPlayers = utils.Filter(t.SeatedPlayers, func(v string) bool {
			return v != clientID
		})
		t.BroadcastMessage(msg.StoodUpMessage(clientID))
	}
}

func HandleStartGameCommand(t *TableWorker, clientID string, data interface{}) {
	if clientID != t.Table.HostID {
		t.DirectMessage(msg.ErrorMessage(clientID, "only the host can start the game"))
	} else if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if len(t.SeatedPlayers) != game.PlayerCount {
		t.DirectMessage(msg.ErrorMessage(clientID, "not enough players"))
	} else {
		// Start a new game
		t.Game = game.NewGame(t.SeatedPlayers, t.GameSettings)
		// Start the first hand
		t.Game.StartNewHand()
		// Announce the start of the game
		t.BroadcastMessage(msg.GameStartedMessage(t.Game.PlayerOrder))
		for _, playerID := range t.Game.PlayerOrder {
			t.DirectMessage(msg.DealHandMessage(
				playerID,
				t.Game.WhoIsDealer(),
				t.Game.Players.GetHand(playerID),
			))
		}
		t.BroadcastMessage(msg.UpNextMessage(t.Game.Phase, t.Game.WhoIsNext()))
	}
}

func HandleEndGameCommand(t *TableWorker, clientID string, data interface{}) {
	if clientID != t.Table.HostID {
		t.DirectMessage(msg.ErrorMessage(clientID, "only the host can end the game"))
	} else if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game has not been initialized"))
	} else {
		// Reset Players for the next game
		t.SeatedPlayers = []string{t.Table.HostID}
		t.BroadcastMessage(msg.GameOverMessage())
		t.Game = nil
	}
}

func HandlePickCommand(t *TableWorker, clientID string, data interface{}) {
	if !t.Game.HandInProgress() {
		t.DirectMessage(msg.ErrorMessage(clientID, "hand not in progress"))
	} else if result, err := t.Game.Pick(clientID); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
	} else {
		t.BroadcastMessage(msg.BlindPickedMessage(clientID, false))
		t.DirectMessage(msg.PickedCardsMessage(clientID, result.Blind))
		t.BroadcastMessage(msg.UpNextMessage(t.Game.Phase, t.Game.WhoIsNext()))
	}
}

func HandlePassCommand(t *TableWorker, clientID string, data interface{}) {
	if !t.Game.HandInProgress() {
		t.DirectMessage(msg.ErrorMessage(clientID, "hand not in progress"))
	} else if result, err := t.Game.Pass(clientID); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
	} else {
		if result != nil {
			t.BroadcastMessage(msg.BlindPickedMessage(result.PickerID, true))
			t.DirectMessage(msg.PickedCardsMessage(clientID, result.Blind))
		}
		t.BroadcastMessage(msg.UpNextMessage(t.Game.Phase, t.Game.WhoIsNext()))
	}
}

func HandleBuryCommand(t *TableWorker, clientID string, data interface{}) {
	if !t.Game.HandInProgress() {
		t.DirectMessage(msg.ErrorMessage(clientID, "hand not in progress"))
	} else if params, err := msg.ExtractParams[msg.BuryCommandParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else if result, err := t.Game.BuryCards(clientID, params.Cards); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
	} else {
		t.DirectMessage(msg.BuriedCardsMessage(clientID, result.Bury))
		if result.GoneAlone {
			t.BroadcastMessage(msg.GoneAloneMessage())
		} else if result.CallResult != nil {
			t.BroadcastMessage(msg.CalledCardMessage(result.CallResult.CalledCard))
		}
		if t.Game.Phase == game.HandPhase.Play {
			t.BroadcastMessage(msg.NewTrickMessage(t.Game.GetTurnOrder()))
		}
		t.BroadcastMessage(msg.UpNextMessage(t.Game.Phase, t.Game.WhoIsNext()))
	}
}

func HandleCallCommand(t *TableWorker, clientID string, data interface{}) {
	if !t.Game.HandInProgress() {
		t.DirectMessage(msg.ErrorMessage(clientID, "hand not in progress"))
	} else if params, err := msg.ExtractParams[msg.CallCommandParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else if result, err := t.Game.CallPartner(clientID, params.Card); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
	} else {
		t.BroadcastMessage(msg.CalledCardMessage(result.CalledCard))
		t.BroadcastMessage(msg.UpNextMessage(t.Game.Phase, t.Game.WhoIsNext()))
		t.BroadcastMessage(msg.NewTrickMessage(t.Game.GetTurnOrder()))
	}
}

func HandleGoAloneCommand(t *TableWorker, clientID string, data interface{}) {
	if !t.Game.HandInProgress() {
		t.DirectMessage(msg.ErrorMessage(clientID, "hand not in progress"))
	} else if _, err := t.Game.GoAlone(clientID); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
	} else {
		t.BroadcastMessage(msg.GoneAloneMessage())
		t.BroadcastMessage(msg.UpNextMessage(t.Game.Phase, t.Game.WhoIsNext()))
	}
}

func HandlePlayCardCommand(t *TableWorker, clientID string, data interface{}) {
	if !t.Game.HandInProgress() {
		t.DirectMessage(msg.ErrorMessage(clientID, "hand not in progress"))
	} else if params, err := msg.ExtractParams[msg.PlayCardCommandParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else if result, err := t.Game.PlayCard(clientID, params.Card); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
	} else {
		t.BroadcastMessage(msg.CardPlayedMessage(clientID, result.PlayedCard))
		if result.PartnerID != "" {
			// Partner has been revealed, let all players know
			t.BroadcastMessage(msg.PartnerRevealedMessage(result.PartnerID))
		}
		if result.TrickSummary == nil {
			// Trick is not over, continue to the next player
			t.BroadcastMessage(msg.UpNextMessage(t.Game.Phase, t.Game.WhoIsNext()))
		} else {
			t.BroadcastMessage(msg.TrickDoneMessage(result.TrickSummary, result.HandSummary))
			if result.HandSummary == nil {
				// Trick is over, but the hand is not, continue to the next player
				// and send along the turn order for the next trick
				t.BroadcastMessage(msg.NewTrickMessage(t.Game.GetTurnOrder()))
				t.BroadcastMessage(msg.UpNextMessage(t.Game.Phase, t.Game.WhoIsNext()))
			}
		}
	}
}
