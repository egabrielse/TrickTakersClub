package service

import (
	"common/list"
	"common/logging"
	"main/service/msg"
	"sheepshead"
	"sheepshead/hand"
)

func HandleUpdateCallingMethod(t *TableWorker, clientID string, data interface{}) {
	if t.Table.HostID != clientID {
		t.DirectMessage(msg.ErrorMessage(clientID, "only the host can update settings"))
	} else if t.Game != nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game already in progress"))
	} else if params, err := msg.ExtractParams[msg.UpdateCallingMethodParams](data); logging.LogOnError(err) {
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
	} else if params, err := msg.ExtractParams[msg.UpdateNoPickResolutionParams](data); logging.LogOnError(err) {
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
	} else if params, err := msg.ExtractParams[msg.UpdateDoubleOnTheBumpParams](data); logging.LogOnError(err) {
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
	} else if !list.Contains(t.SeatedPlayers, clientID) {
		t.DirectMessage(msg.ErrorMessage(clientID, "not a player"))
	} else {
		t.SeatedPlayers = list.Filter(t.SeatedPlayers, func(v string) bool {
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
		t.Game = sheepshead.NewGame(t.SeatedPlayers, t.GameSettings)
		// Announce the start of the game
		t.BroadcastMessage(msg.GameStartedMessage(t.Game.PlayerOrder))
		currentHand := t.Game.GetCurrentHand()
		for _, playerID := range t.Game.PlayerOrder {
			t.DirectMessage(msg.DealHandMessage(
				playerID,
				t.Game.WhoIsDealer(),
				currentHand.PlayerHands.GetHand(playerID),
				currentHand.Blind.PickOrder,
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

func HandleCallLastHandCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game has not been initialized"))
	} else if t.Game.IsLastHand() {
		t.DirectMessage(msg.ErrorMessage(clientID, "last hand already called"))
	} else {
		t.Game.CallLastHand()
		t.BroadcastMessage(msg.LastHandMessage(clientID))
	}
}

func HandlePickCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game not in progress"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.Pick(clientID); logging.LogOnError(err) {
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
		if result, err := currentHand.Pass(clientID); logging.LogOnError(err) {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			if result.PickResult != nil {
				pickerID := result.PickResult.PickerID
				blind := result.PickResult.Blind
				t.BroadcastMessage(msg.BlindPickedMessage(pickerID, true))
				t.DirectMessage(msg.PickedCardsMessage(pickerID, blind))
			} else if result.AllPassed {
				t.BroadcastMessage(msg.NoPickHandMessage())
			}
			t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
		}
	}
}

func HandleBuryCommand(t *TableWorker, clientID string, data interface{}) {
	if t.Game == nil {
		t.DirectMessage(msg.ErrorMessage(clientID, "game not in progress"))
	} else if params, err := msg.ExtractParams[msg.BuryCommandParams](data); logging.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.BuryCards(clientID, params.Cards); logging.LogOnError(err) {
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
	} else if params, err := msg.ExtractParams[msg.CallCommandParams](data); logging.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.CallPartner(clientID, params.Card); logging.LogOnError(err) {
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
		if result, err := currentHand.GoAlone(clientID, false); logging.LogOnError(err) {
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
	} else if params, err := msg.ExtractParams[msg.PlayCardCommandParams](data); logging.LogOnError(err) {
		t.DirectMessage(msg.ErrorMessage(clientID, "invalid settings payload"))
	} else {
		currentHand := t.Game.GetCurrentHand()
		if result, err := currentHand.PlayCard(clientID, params.Card); logging.LogOnError(err) {
			t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
		} else {
			t.BroadcastMessage(msg.CardPlayedMessage(clientID, result.PlayedCard))
			if result.PartnerID != "" {
				// Partner has been revealed, let all players know
				t.BroadcastMessage(msg.PartnerRevealedMessage(result.PartnerID))
			}
			if result.TrickComplete {
				if !result.HandComplete {
					t.BroadcastMessage(msg.TrickWonMessage(result.TakerID, nil))
					// Trick is complete, but hand is not, start the next trick
					newTrick := currentHand.GetCurrentTrick()
					t.BroadcastMessage(msg.NewTrickMessage(newTrick.TurnOrder))
					t.BroadcastMessage(msg.UpNextMessage(t.Game.GetUpNext()))
				} else {
					if currentHand.Blind.IsNoPickHand() {
						// Include the blind in the trick won message if a no pick hand
						// Player that takes the last trick also takes the blind in leasters/mosters
						t.BroadcastMessage(msg.TrickWonMessage(result.TakerID, currentHand.Blind.Cards))
					} else {
						t.BroadcastMessage(msg.TrickWonMessage(result.TakerID, nil))
					}
					// Hand is complete, summarize the hand for players
					scoreboard := t.Game.TallyScores()
					if summary, err := currentHand.SummarizeHand(); logging.LogOnError(err) {
						t.DirectMessage(msg.ErrorMessage(clientID, err.Error()))
					} else {
						t.BroadcastMessage(msg.HandDoneMessage(summary, scoreboard))
					}
					if t.Game.IsLastHand() {
						// A player has said it's their last hand, end the game
						t.BroadcastMessage(msg.GameOverMessage(scoreboard))
						// Clear the game from state
						t.Game = nil
						// Reset seated players
						t.SeatedPlayers = []string{t.Table.HostID}
					} else {
						//  Otherwise, start a new hand
						t.Game.StartNewHand()
						currentHand = t.Game.GetCurrentHand()
						for _, playerID := range t.Game.PlayerOrder {
							t.DirectMessage(msg.DealHandMessage(
								playerID,
								t.Game.WhoIsDealer(),
								currentHand.PlayerHands.GetHand(playerID),
								currentHand.Blind.PickOrder,
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
