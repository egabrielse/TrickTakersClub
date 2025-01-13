package game

import (
	"fmt"
	"main/domain/game/deck"
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
	}
	for _, id := range g.PlayerOrder {
		if id == playerID {
			return fmt.Errorf("player already seated")
		}
	}
	g.PlayerOrder = append(g.PlayerOrder, playerID)
	// Game automatically starts when all seats are filled
	if len(g.PlayerOrder) == g.Settings.PlayerCount {
		if err := g.StartGame(); err != nil {
			return err
		}
	}
	return nil
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

func (g *Game) StartGame() error {
	if len(g.PlayerOrder) != g.Settings.PlayerCount {
		return fmt.Errorf("not enough players")
	} else {
		g.Scoreboard = NewScoreboard(g.PlayerOrder)
		g.StartNewHand()
		return nil
	}
}

func (g *Game) StartNewHand() {
	g.DealerIndex = (g.DealerIndex + 1) % len(g.PlayerOrder)
	playerOrder := utils.RelistStartingWith(g.PlayerOrder, g.PlayerOrder[g.DealerIndex])
	g.Hand = NewHand(playerOrder, deck.NewDeck(), g.Settings)
}

func (g *Game) HandInProgress() bool {
	return g.Hand != nil
}

func (g *Game) GetUpNext() *UpNext {
	if g.Hand == nil {
		return nil
	}
	return &UpNext{
		PlayerID: g.Hand.WhoIsNext(),
		Phase:    g.Hand.Phase,
	}
}
