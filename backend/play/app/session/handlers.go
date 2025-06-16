package session

import (
	"common/logging"
	"play/app/msg"
	"play/utils"
	"sheepshead/hand"

	"github.com/sirupsen/logrus"
)

func PongHandler(sw *SessionWorker, message *msg.Message) {
	sw.session.KeepAlive(message.SenderID)
}

func EnterHandler(sw *SessionWorker, message *msg.Message) {
	logrus.Infof("Session (%s): %s enter message received", sw.session.ID, message.SenderID)
	if err := sw.session.Join(message.SenderID); err != nil {
		// If the user cannot join the session, inform them with an error message.
		sw.sendMessage(message.SenderID, msg.NewSessionFullMessage())
		return
	} else {
		// Send a welcome message to the new player.
		logrus.Infof("Session (%s): sending welcome message to %s", sw.session.ID, message.SenderID)
		sw.sendMessage(message.SenderID, msg.NewWelcomeMessage(
			message.SenderID,
			sw.session.HostID,
			sw.session.ID,
			sw.session.ListPresentPlayers(),
			sw.session.Game,
		))
		logrus.Infof("Session (%s): %s has joined the session", sw.session.ID, message.SenderID)
		enterMsg := msg.NewEnteredMessage(message.SenderID, sw.session.Game.Seating)
		// Notify all clients of new player joining the session.
		sw.broadcastMessage(enterMsg)
	}
}

func LeaveHandler(sw *SessionWorker, message *msg.Message) {
	sw.session.Leave(message.SenderID)
	// Notify all clients that a player has left the session.
	sw.broadcastMessage(msg.NewLeftMessage(message.SenderID, sw.session.Game.Seating))
}

func UpdateCallingMethodHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.HostID != message.SenderID {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("only the host can update settings"))
	} else if sw.session.Game.HasGameStarted() {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game already in progress"))
	} else if params, err := utils.UnmarshalTo[msg.UpdateCallingMethodPayload](message.Data); logging.LogOnError(err) {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("invalid settings payload"))
	} else {
		if err := sw.session.Game.Settings.SetCallingMethod(params.CallingMethod); err != nil {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			sw.broadcastMessage(msg.NewSettingsUpdatedMessage(sw.session.Game.Settings))
		}
	}
}

func UpdateNoPickResolutionHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.HostID != message.SenderID {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("only the host can update settings"))
	} else if sw.session.Game.HasGameStarted() {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game already in progress"))
	} else if params, err := utils.UnmarshalTo[msg.UpdateNoPickResolutionPayload](message.Data); logging.LogOnError(err) {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("invalid settings payload"))
	} else {
		if err := sw.session.Game.Settings.SetNoPickResolution(params.NoPickResolution); err != nil {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			sw.broadcastMessage(msg.NewSettingsUpdatedMessage(sw.session.Game.Settings))
		}
	}
}

func UpdateDoubleOnTheBumpHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.HostID != message.SenderID {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("only the host can update settings"))
	} else if sw.session.Game.HasGameStarted() {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game already in progress"))
	} else if params, err := utils.UnmarshalTo[msg.UpdateDoubleOnTheBumpPayload](message.Data); logging.LogOnError(err) {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("invalid settings payload"))
	} else {
		sw.session.Game.Settings.SetDoubleOnTheBump(params.DoubleOnTheBump)
		sw.broadcastMessage(msg.NewSettingsUpdatedMessage(sw.session.Game.Settings))
	}
}

func StartGameHandler(sw *SessionWorker, message *msg.Message) {
	if message.SenderID != sw.session.HostID {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("only the host can start the game"))
	} else if err := sw.session.StartGame(); err != nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
	} else {
		// Announce the start of the game
		sw.broadcastMessage(msg.NewGameOnMessage(sw.session.Game.Seating))
		currentHand := sw.session.Game.GetCurrentHand()
		// Deal hands to players
		for _, playerID := range sw.session.Game.Seating {
			sw.sendMessage(playerID, msg.NewDealHandMessage(
				sw.session.Game.WhoIsDealer(),
				currentHand.PlayerHands.GetHand(playerID),
				currentHand.Blind.PickOrder,
			))
		}
		sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
	}
}

func EndGameHandler(sw *SessionWorker, message *msg.Message) {
	if message.SenderID != sw.session.HostID {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("only the host can end the game"))
	} else if sw.session.Game == nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game has not been initialized"))
	} else {
		sw.broadcastMessage(msg.NewGameOverMessage(sw.session.Game.TallyScores()))
		sw.session.ResetGame()
	}
}

func CallLastHandHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.Game == nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game has not been initialized"))
	} else if sw.session.Game.IsLastHand() {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("last hand already called"))
	} else {
		sw.session.Game.CallLastHand()
		sw.broadcastMessage(msg.NewLastHandMessage(message.SenderID))
	}
}

func PickHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.Game == nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game not in progress"))
	} else {
		currentHand := sw.session.Game.GetCurrentHand()
		if result, err := currentHand.Pick(message.SenderID); logging.LogOnError(err) {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			sw.broadcastMessage(msg.NewBlindPickedMessage(message.SenderID, false))
			sw.sendMessage(message.SenderID, msg.NewPickedCardsMessage(result.Blind))
			sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
		}
	}
}

func PassHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.Game == nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game not in progress"))
	} else {
		currentHand := sw.session.Game.GetCurrentHand()
		if result, err := currentHand.Pass(message.SenderID); logging.LogOnError(err) {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			if result.PickResult != nil {
				pickerID := result.PickResult.PickerID
				blind := result.PickResult.Blind
				sw.broadcastMessage(msg.NewBlindPickedMessage(pickerID, true))
				sw.sendMessage(pickerID, msg.NewPickedCardsMessage(blind))
			} else if result.AllPassed {
				sw.broadcastMessage(msg.NewNoPickHandMessage())
			}
			sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
		}
	}
}

func BuryHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.Game == nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game not in progress"))
	} else if params, err := utils.UnmarshalTo[msg.BuryMessagePayload](message.Data); logging.LogOnError(err) {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("invalid settings payload"))
	} else {
		currentHand := sw.session.Game.GetCurrentHand()
		if result, err := currentHand.BuryCards(message.SenderID, params.Cards); logging.LogOnError(err) {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			sw.sendMessage(message.SenderID, msg.NewBuriedCardsMessage(result.Bury))
			if result.CallResult != nil {
				sw.broadcastMessage(msg.NewCardCalledMessage(result.CallResult.CalledCard))
			} else if result.GoAloneResult != nil {
				sw.broadcastMessage(msg.NewGoneAloneMessage(result.GoAloneResult.Forced))
			}
			if currentHand.Phase == hand.HandPhase.Play {
				newTrick := currentHand.GetCurrentTrick()
				sw.broadcastMessage(msg.NewStartTrickMessage(newTrick.TurnOrder))
			}
			sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
		}
	}
}

func CallHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.Game == nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game not in progress"))
	} else if params, err := utils.UnmarshalTo[msg.CallMessagePayload](message.Data); logging.LogOnError(err) {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("invalid settings payload"))
	} else {
		currentHand := sw.session.Game.GetCurrentHand()
		if result, err := currentHand.CallPartner(message.SenderID, params.Card); logging.LogOnError(err) {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			sw.broadcastMessage(msg.NewCardCalledMessage(result.CalledCard))
			sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
			newTrick := currentHand.GetCurrentTrick()
			sw.broadcastMessage(msg.NewStartTrickMessage(newTrick.TurnOrder))
		}
	}
}

func GoAloneHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.Game == nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game not in progress"))
	} else {
		currentHand := sw.session.Game.GetCurrentHand()
		if result, err := currentHand.GoAlone(message.SenderID, false); logging.LogOnError(err) {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			sw.broadcastMessage(msg.NewGoneAloneMessage(result.Forced))
			sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
		}
	}
}

func PlayCardHandler(sw *SessionWorker, message *msg.Message) {
	if sw.session.Game == nil {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("game not in progress"))
	} else if params, err := utils.UnmarshalTo[msg.PlayCardMessagePayload](message.Data); logging.LogOnError(err) {
		sw.sendMessage(message.SenderID, msg.NewErrorMessage("invalid settings payload"))
	} else {
		currentHand := sw.session.Game.GetCurrentHand()
		if result, err := currentHand.PlayCard(message.SenderID, params.Card); logging.LogOnError(err) {
			sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
		} else {
			sw.broadcastMessage(msg.NewCardPlayedMessage(message.SenderID, result.PlayedCard))
			if result.PartnerID != "" {
				// Partner has been revealed, let all players know
				sw.broadcastMessage(msg.NewPartnerRevealedMessage(result.PartnerID))
			}
			if result.TrickComplete {
				if !result.HandComplete {
					sw.broadcastMessage(msg.NewTrickWonMessage(result.TakerID, nil))
					// Trick is complete, but hand is not, start the next trick
					newTrick := currentHand.GetCurrentTrick()
					sw.broadcastMessage(msg.NewStartTrickMessage(newTrick.TurnOrder))
					sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
				} else {
					if currentHand.Blind.IsNoPickHand() {
						// Include the blind in the trick won message if a no pick hand
						// Player that takes the last trick also takes the blind in leasters/mosters
						sw.broadcastMessage(msg.NewTrickWonMessage(result.TakerID, currentHand.Blind.Cards))
					} else {
						sw.broadcastMessage(msg.NewTrickWonMessage(result.TakerID, nil))
					}
					// Hand is complete, summarize the hand for players
					scoreboard := sw.session.Game.TallyScores()
					if summary, err := currentHand.SummarizeHand(); logging.LogOnError(err) {
						sw.sendMessage(message.SenderID, msg.NewErrorMessage(err.Error()))
					} else {
						sw.broadcastMessage(msg.NewHandDoneMessage(summary, scoreboard))
					}
					if sw.session.Game.IsLastHand() {
						// A player has said it's their last hand, end the game
						sw.broadcastMessage(msg.NewGameOverMessage(scoreboard))
						// Clear the game from state
						sw.session.Game = nil
					} else {
						//  Otherwise, start a new hand
						sw.session.Game.StartNewHand()
						currentHand = sw.session.Game.GetCurrentHand()
						for _, playerID := range sw.session.Game.Seating {
							sw.sendMessage(playerID, msg.NewDealHandMessage(
								sw.session.Game.WhoIsDealer(),
								currentHand.PlayerHands.GetHand(playerID),
								currentHand.Blind.PickOrder,
							))
						}
						sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
					}
				}
			} else {
				// Trick is not over, continue to the next player
				sw.broadcastMessage(msg.NewUpNextMessage(sw.session.Game.GetUpNext()))
			}
		}
	}
}
