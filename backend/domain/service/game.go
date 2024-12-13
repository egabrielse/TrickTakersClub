package service

import (
	"fmt"
	"main/domain/game"
)

type Sheepshead struct {
	InProgress  bool               `json:"inProgress"`  // Whether the game is in progress
	PlayerOrder []string           `json:"playerOrder"` // Order of players at the table
	Settings    *game.GameSettings `json:"settings"`    // Game settings
}

func NewSheepshead(playerIDs []string, settings *game.GameSettings) *Sheepshead {
	game := &Sheepshead{
		InProgress:  false,
		PlayerOrder: playerIDs,
		Settings:    settings,
	}
	return game
}

func (g *Sheepshead) GetState() *GameStatePayload {
	return &GameStatePayload{
		InProgress:  g.InProgress,
		PlayerOrder: g.PlayerOrder,
		Settings:    g.Settings,
	}
}

func (g *Sheepshead) SitDown(playerID string) error {
	if g.InProgress || len(g.PlayerOrder) == g.Settings.PlayerCount {
		return fmt.Errorf("game in progress")
	} else {
		for _, id := range g.PlayerOrder {
			if id == playerID {
				return fmt.Errorf("player already seated")
			}
		}
		g.PlayerOrder = append(g.PlayerOrder, playerID)
		// Game automatically starts when all seats are filled
		if len(g.PlayerOrder) == g.Settings.PlayerCount {
			g.StartNewHand()
		}
		return nil
	}
}

func (g *Sheepshead) StandUp(playerID string) error {
	if g.InProgress {
		return fmt.Errorf("game in progress")
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

func (g *Sheepshead) StartNewHand() {
	g.InProgress = true
}
