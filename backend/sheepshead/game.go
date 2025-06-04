package sheepshead

import (
	"encoding/json"
	"sheepshead/hand"
	"sheepshead/scoring"
	"sheepshead/utils"
)

type Game struct {
	ID          string             `json:"id"`          // Id of the game
	HostID      string             `json:"hostId"`      // Id of the host player
	DealerIndex int                `json:"dealerIndex"` // Index of the dealer
	Hands       []*hand.Hand       `json:"hands"`       // Hands played
	PlayerOrder []string           `json:"playerOrder"` // Order of players at the table
	Settings    *hand.GameSettings `json:"settings"`    // Game settings
	LastHand    bool               `json:"lastHand"`    // True if it's the last hand of the game
}

// Creates a new Game and initializes the first hand
func NewGame(ID string, HostID string, playerOrder []string, settings *hand.GameSettings) *Game {
	return &Game{
		ID:          ID,
		HostID:      HostID,
		DealerIndex: 0,
		Hands:       []*hand.Hand{hand.NewHand(playerOrder, settings)},
		PlayerOrder: playerOrder,
		Settings:    settings,
		LastHand:    false,
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
			summary, _ := hand.SummarizeHand()
			scoreboard.TallyHand(
				summary.Payouts,
				summary.Winners,
			)
		}
	}
	return scoreboard
}

func (g *Game) CallLastHand() {
	g.LastHand = true
}

func (g *Game) IsLastHand() bool {
	return g.LastHand
}

func (g *Game) MarshalBinary() ([]byte, error) {
	return json.Marshal(g)
}

func (g *Game) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, g)
}
