package service

import (
	"main/domain/game"
	"main/domain/game/hand"
	"main/domain/service/msg"
	"main/utils"
)

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
	} else if len(t.SeatedPlayers) == hand.PlayerCount {
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
	} else if len(t.SeatedPlayers) != hand.PlayerCount {
		t.DirectMessage(msg.ErrorMessage(clientID, "not enough players"))
	} else {
		// Start a new game
		t.Game = game.NewGame(t.SeatedPlayers, t.GameSettings)
		// Announce the start of the game
		t.BroadcastMessage(msg.GameStartedMessage(t.Game.PlayerOrder))
		currentHand := t.Game.GetCurrentHand()
		for _, playerID := range t.Game.PlayerOrder {
			t.DirectMessage(msg.DealHandMessage(
				playerID,
				t.Game.WhoIsDealer(),
				currentHand.PlayerHands.GetHand(playerID),
			))
		}
		t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
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
		t.BroadcastMessage(msg.GameOverMessage(t.Game.TallyScores()))
		t.Game = nil
	}
}

func HandleToggleLastHandCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game has not been initialized"))
	} else {
		lastHand := t.Game.ToggleLastHand(clientID)
		t.BroadcastMessage(msg.LastHandStatusMessage(clientID, lastHand))
	}
}

func HandlePickCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game not in progress"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.Pick(clientID); utils.LogOnError(err) {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			t.BroadcastMessage(msg.BlindPickedMessage(clientID, false))
			t.DirectMessage(msg.PickedCardsMessage(clientID, result.Blind))
			t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
		}
	}
}

func HandlePassCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game not in progress"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.Pass(clientID); utils.LogOnError(err) {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			if result.PickResult != nil {
				pickerID := result.PickResult.PickerID
				blind := result.PickResult.Blind
				t.BroadcastMessage(msg.BlindPickedMessage(pickerID, true))
				t.DirectMessage(msg.PickedCardsMessage(clientID, blind))
			}
			t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
		}
	}
}

func HandleBuryCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game not in progress"))
	} else if params, err := msg.ExtractParams[msg.BuryCommandParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.BuryCards(clientID, params.Cards); utils.LogOnError(err) {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			t.DirectMessage(msg.BuriedCardsMessage(clientID, result.Bury))
			if result.CallResult != nil {
				t.BroadcastMessage(msg.CalledCardMessage(result.CallResult.CalledCard))
			} else if result.GoAloneResult != nil {
				t.BroadcastMessage(msg.GoneAloneMessage(result.GoAloneResult.Forced))
			}
			if currentHand.Phase == hand.HandPhase.Play {
				newTrick := currentHand.GetCurrentTrick()
				t.BroadcastMessage(msg.NewTrickMessage(newTrick.TurnOrder))
			}
			t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
		}
	}
}

func HandleCallCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game not in progress"))
	} else if params, err := msg.ExtractParams[msg.CallCommandParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.CallPartner(clientID, params.Card); utils.LogOnError(err) {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			t.BroadcastMessage(msg.CalledCardMessage(result.CalledCard))
			t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
			newTrick := currentHand.GetCurrentTrick()
			t.BroadcastMessage(msg.NewTrickMessage(newTrick.TurnOrder))
		}
	}
}

func HandleGoAloneCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game not in progress"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.GoAlone(clientID, false); utils.LogOnError(err) {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			t.BroadcastMessage(msg.GoneAloneMessage(result.Forced))
			t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
		}
	}
}

func HandlePlayCardCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game not in progress"))
	} else if params, err := msg.ExtractParams[msg.PlayCardCommandParams](data); utils.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.PlayCard(clientID, params.Card); utils.LogOnError(err) {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			t.BroadcastMessage(msg.CardPlayedMessage(clientID, result.PlayedCard))
			if result.PartnerID != "" {
				// Partner has been revealed, let all players know
				t.BroadcastMessage(msg.PartnerRevealedMessage(result.PartnerID))
			}
			if result.TrickComplete {
				// Trick is complete, let all players know who took the trick
				t.BroadcastMessage(msg.TrickWonMessage(result.TakerID))
				if !result.HandComplete {
					// Trick is complete, but hand is not, start the next trick
					newTrick := currentHand.GetCurrentTrick()
					t.BroadcastMessage(msg.NewTrickMessage(newTrick.TurnOrder))
					t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
				} else {
					// Hand is complete, summarize the hand for players
					if summary, err := currentHand.SummarizeHand(); utils.LogOnError(err) {
						t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
					} else {
						t.BroadcastMessage(msg.HandDoneMessage(summary))
					}
					if t.Game.IsLastHand() {
						// A player has said it's their last hand, end the game
						t.BroadcastMessage(msg.GameOverMessage(t.Game.TallyScores()))
						t.Game = nil
					} else {
						//  Otherwise, start a new hand
						t.Game.StartNewHand()
						currentHand = t.Game.GetCurrentHand()
						for _, playerID := range t.Game.PlayerOrder {
							t.DirectMessage(msg.DealHandMessage(
								playerID,
								t.Game.WhoIsDealer(),
								currentHand.PlayerHands.GetHand(playerID),
							))
						}
						t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
					}
				}
			} else {
				// Trick is not over, continue to the next player
				t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
			}
		}
	}
}
