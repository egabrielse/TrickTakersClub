package game

import (
	"fmt"
	"main/utils"
)

type Game struct {
	DealerIndex int           `json:"dealerIndex"` // Index of the dealer in the Players array
	Scoreboard  Scoreboard    `json:"scoreboard"`  // Scoreboard
	Hand        *Hand         `json:"hand"`        // Current hand being played
	HandsPlayed int           `json:"handsPlayed"` // Number of hands played
	PlayerOrder []string      `json:"playerOrder"` // Order of players at the table
	Settings    *GameSettings `json:"settings"`    // Game settings
}

func NewGame(playerIDs []string, settings *GameSettings) *Game {
	game := &Game{
		DealerIndex: -1,
		HandsPlayed: 0,
		Scoreboard:  nil,
		PlayerOrder: playerIDs,
		Settings:    settings,
	}
	return game
}

func (g *Game) SitDown(playerID string) error {
	if g.HandInProgress() || len(g.PlayerOrder) == g.Settings.PlayerCount {
		return fmt.Errorf("hand in progress")
	} else {
		for _, id := range g.PlayerOrder {
			if id == playerID {
				return fmt.Errorf("player already seated")
			}
		}
		g.PlayerOrder = append(g.PlayerOrder, playerID)
		// Game automatically starts when all seats are filled
		if len(g.PlayerOrder) == g.Settings.PlayerCount {
			g.StartGame()
		}
		return nil
	}
}

func (g *Game) StandUp(playerID string) error {
	if g.HandInProgress() {
		return fmt.Errorf("hand in progress")
	} else {
		for index, id := range g.PlayerOrder {
			if id == playerID {
				g.PlayerOrder = append(g.PlayerOrder[:index], g.PlayerOrder[index+1:]...)
				return nil
			}
		}
		return fmt.Errorf("player not seated")
	}
}

func (g *Game) StartGame() {
	g.Scoreboard = NewScoreboard(g.PlayerOrder)
	g.StartNewHand()
}

func (g *Game) StartNewHand() {
	g.DealerIndex = (g.DealerIndex + 1) % len(g.PlayerOrder)
	playerOrder := utils.RelistStartingWith(g.PlayerOrder, g.PlayerOrder[g.DealerIndex])
	g.Hand = NewHand(g.Settings, playerOrder, 0)
}

func (g *Game) HandInProgress() bool {
	return g.Hand != nil
}

// func (g *Game) GetNextTurn() *NextTurn {
// 	if g.Hand == nil {
// 		return nil
// 	} else if upNextID := g.Hand.WhoIsNext(); upNextID == "" {
// 		return nil
// 	} else if player, err := g.Hand.ValidateUpNext(upNextID); err != nil {
// 		return nil
// 	} else {
// 		nextTurn := NewNextTurn()
// 		nextTurn.PlayerID = upNextID
// 		nextTurn.TurnType = g.Hand.Phase
// 		switch g.Hand.Phase {
// 		case HandPhase.Pick:
// 			nextTurn.TurnType = TurnTypePick
// 			// nextTurn.BlindSize = g.Settings.BlindSize
// 		case HandPhase.Call:
// 			nextTurn.TurnType = TurnTypeCall
// 			// TODO: Get list of cards to call
// 			// TODO: Determine if blitz is possible
// 		case HandPhase.Bury:
// 			nextTurn.TurnType = TurnTypeBury
// 			// TODO: Get list of cards to bury
// 			nextTurn.Cards = player.Hand
// 			// nextTurn.BlindSize = g.Settings.BlindSize
// 		case HandPhase.Play:
// 			nextTurn.TurnType = TurnTypePlay
// 			trick := g.Hand.GetCurrentTrick()
// 			leadCard := trick.GetLeadingCard()
// 			playableCards := deck.FilterForPlayableCards(player.Hand, leadCard)
// 			deck.OrderCards(playableCards)
// 			nextTurn.Cards = playableCards
// 		}
// 		return nextTurn
// 	}
// }

// func (g *Game) UpdateScores(summary *HandSummary) {
// 	for _, player := range g.Players {
// 		row := g.Scoreboard[player.PlayerID]
// 		row.Score += summary.Scores[player.PlayerID]
// 		row.TotalPoints += summary.PointsWon[player.PlayerID]
// 		row.TotalTricks += summary.TricksWon[player.PlayerID]
// 	}
// }

// func (g *Game) TakeTurn(turn *Turn) error {
// 	if g.Hand == nil {
// 		return fmt.Errorf("no hand in progress")
// 	} else if g.Hand.WhoIsNext() != turn.PlayerID {
// 		return fmt.Errorf("not %s's turn", turn.PlayerID)
// 	} else if player, ok := g.Players[turn.PlayerID]; !ok {
// 		return fmt.Errorf("player not found")
// 	} else {
// 		result := NewTurnResult()
// 		playedTricksCount := g.Hand.CountPlayedTricks()
// 		switch turn.TurnType {
// 		case TurnTypePick:
// 			if turn.Args.Pick {
// 				result.PickedCards = make([]*deck.Card, len(g.Hand.Blind))
// 				copy(result.PickedCards, g.Hand.Blind)
// 			}
// 			if err := g.Hand.PickOrPass(player, turn.Args.Pick); err != nil {
// 				return err
// 			}

// 		case TurnTypeCall:
// 			var card *deck.Card
// 			if len(turn.Args.Cards) > 1 {
// 				return fmt.Errorf("can only call one card")
// 			} else if len(turn.Args.Cards) == 1 {
// 				card = turn.Args.Cards[0]
// 			}
// 			if err := g.Hand.Call(player, g.Players, card); err != nil {
// 				return err
// 			}

// 		case TurnTypeBury:
// 			result.BuriedCards = make([]*deck.Card, len(turn.Args.Cards))
// 			copy(result.BuriedCards, turn.Args.Cards)
// 			if err := g.Hand.Bury(player, turn.Args.Cards); err != nil {
// 				return err
// 			}
// 			result.NextTrick = g.Hand.GetThisTrick()

// 		case TurnTypePlay:
// 			if len(turn.Args.Cards) != 1 {
// 				return fmt.Errorf("must play one card")
// 			}
// 			card := turn.Args.Cards[0]
// 			result.PlayedCard = card
// 			if err := g.Hand.Play(player, card); err != nil {
// 				return err
// 			}
// 			// Check if the trick is completed
// 			result.TrickCompleted = playedTricksCount < g.Hand.CountPlayedTricks()
// 			if result.TrickCompleted {
// 				lastTrick := g.Hand.GetLastTrick()
// 				result.TrickSummary = &TrickSummary{
// 					TakerID: lastTrick.GetTakerID(),
// 					Cards:   lastTrick.Cards,
// 					Points:  lastTrick.CountPoints(),
// 				}
// 				// Check if the hand is completed
// 				if g.Hand.IsComplete() {
// 					result.HandCompleted = true
// 					result.HandSummary = g.Hand.SummarizeHand(g.Players)
// 					g.UpdateScores(result.HandSummary)
// 				} else {
// 					result.NextTrick = g.Hand.GetThisTrick()
// 				}
// 			}
// 		}
// 		turn.Result = result
// 		turn.NextTurn = g.GetNextTurn()
// 		return nil
// 	}
// }
