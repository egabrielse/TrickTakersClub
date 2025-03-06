package game

import (
	"main/domain/game/game_settings"
	"main/domain/game/hand"
	"main/domain/game/scoring"
	"main/utils"

	"github.com/sirupsen/logrus"
)

type Game struct {
	DealerIndex int                         `json:"dealerIndex"` // Index of the dealer
	Hands       []*hand.Hand                `json:"hands"`       // Hands played
	PlayerOrder []string                    `json:"playerOrder"` // Order of players at the table
	Settings    *game_settings.GameSettings `json:"settings"`    // Game settings
	LastHand    map[string]bool             `json:"lastHand"`    // Tracks players who have said it's their last hand
}

// Creates a new Game and initializes the first hand
func NewGame(playerOrder []string, settings *game_settings.GameSettings) *Game {
	lastHand := map[string]bool{}
	for _, playerID := range playerOrder {
		lastHand[playerID] = false
	}
	return &Game{
		DealerIndex: 0,
		Hands:       []*hand.Hand{hand.NewHand(playerOrder, settings)},
		PlayerOrder: playerOrder,
		Settings:    settings,
		LastHand:    lastHand,
	}
}

func (g *Game) StartNewHand() {
	// Rotate the dealer
	g.DealerIndex = (g.DealerIndex + 1) % len(g.PlayerOrder)
	turnOrder := utils.RelistStartingWith(g.PlayerOrder, g.PlayerOrder[g.DealerIndex])
	// Start a new hand
	newHand := hand.NewHand(turnOrder, g.Settings)
	g.Hands = append(g.Hands, newHand)
}

func (g *Game) GetCurrentHand() *hand.Hand {
	if len(g.Hands) == 0 {
		return nil
	}
	return g.Hands[len(g.Hands)-1]
}

func (g *Game) CountHandsPlayed() int {
	if len(g.Hands) == 0 {
		return 0
	} else if g.GetCurrentHand().IsComplete() {
		return len(g.Hands)
	}
	return len(g.Hands) - 1
}

func (g *Game) WhoIsDealer() string {
	return g.PlayerOrder[g.DealerIndex]
}

func (g *Game) GetUpNext() (phase string, playerID string) {
	currentHand := g.GetCurrentHand()
	return currentHand.Phase, currentHand.WhoIsNext()
}

func (g *Game) TallyScores() scoring.Scoreboard {
	scoreboard := scoring.NewScoreboard(g.PlayerOrder)
	for _, hand := range g.Hands {
		if hand.IsComplete() {
			if summary, err := hand.SummarizeHand(); err != nil {
				logrus.Warn(err)
			} else {
				for _, playerID := range g.PlayerOrder {
					scoreboard.UpdateScore(
						playerID,
						summary.Scores[playerID],
						summary.PointsWon[playerID],
						summary.TricksWon[playerID],
					)
				}
			}
		}
	}
	return scoreboard
}

func (g *Game) ToggleLastHand(playerID string) bool {
	g.LastHand[playerID] = !g.LastHand[playerID]
	return g.LastHand[playerID]
}

func (g *Game) IsLastHand() bool {
	for _, lastHand := range g.LastHand {
		if lastHand {
			return true
		}
	}
	return false
}
