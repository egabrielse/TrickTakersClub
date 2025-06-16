package sheepshead

import (
	"encoding/json"
	"fmt"
	"sheepshead/hand"
	"sheepshead/scoring"
	"sheepshead/utils"
)

type Game struct {
	DealerIndex int                `json:"dealerIndex"` // Index of the dealer
	Hands       []*hand.Hand       `json:"hands"`       // Hands played
	Seating     []string           `json:"seating"`     // Order of players at the table
	Settings    *hand.GameSettings `json:"settings"`    // Game settings
	LastHand    bool               `json:"lastHand"`    // True if it's the last hand of the game
}

// Creates a new Game and initializes the first hand
func NewGame() *Game {
	return &Game{
		DealerIndex: -1,
		Hands:       []*hand.Hand{},
		Seating:     make([]string, hand.PlayerCount),
		Settings:    hand.NewGameSettings(),
		LastHand:    false,
	}
}

// Returns true if every seat is filled, false otherwise.
func (g *Game) SeatsAreFilled() bool {
	for i := 0; i < hand.PlayerCount; i++ {
		if g.Seating[i] == "" {
			return false
		}
	}
	return true
}

// Returns true if the game has started, false otherwise.
func (g *Game) HasGameStarted() bool {
	return len(g.Hands) > 0
}

// Returns true if the game is in progress, false otherwise.
func (g *Game) AddPlayer(playerID string) error {
	if g.HasGameStarted() {
		return fmt.Errorf("game has already started")
	} else if g.SeatsAreFilled() {
		return fmt.Errorf("game is full")
	} else if utils.Contains(g.Seating, playerID) {
		return nil // Player already exists in the game
	}
	// Find first empty seat and take it
	for i, id := range g.Seating {
		if id == "" {
			g.Seating[i] = playerID
			return nil
		}
	}
	return fmt.Errorf("no empty seats available")
}

// Drops a player from the game by resetting their seat to empty.
func (g *Game) DropPlayer(playerID string) error {
	if g.HasGameStarted() {
		return fmt.Errorf("game has already started")
	}
	for i, id := range g.Seating {
		if id == playerID {
			g.Seating[i] = "" // Reset the seat
		}
	}
	return nil
}

// Checks if a player is seated at the table.
func (g *Game) IsPlayerSeated(playerID string) bool {
	for _, id := range g.Seating {
		if id == playerID {
			return true
		}
	}
	return false
}

// Starts the game if it has not already started and there are enough players.
func (g *Game) StartGame() error {
	if g.HasGameStarted() {
		return fmt.Errorf("game has already started")
	} else if len(g.Seating) < hand.PlayerCount {
		return fmt.Errorf("not enough players to start the game")
	} else {
		g.StartNewHand()
		return nil
	}
}

func (g *Game) StartNewHand() {
	// Rotate the dealer
	g.DealerIndex = (g.DealerIndex + 1) % len(g.Seating)
	turnOrder := utils.RelistStartingWith(g.Seating, g.Seating[g.DealerIndex])
	// Start a new hand
	newHand := hand.NewHand(turnOrder, g.Settings)
	g.Hands = append(g.Hands, newHand)
}

func (g *Game) GetCurrentHand() *hand.Hand {
	if g.HasGameStarted() {
		return g.Hands[len(g.Hands)-1]
	}
	return nil
}

func (g *Game) WhoIsDealer() string {
	if g.HasGameStarted() {
		return g.Seating[g.DealerIndex]
	}
	return ""
}

func (g *Game) GetUpNext() (phase string, playerID string) {
	currentHand := g.GetCurrentHand()
	if currentHand == nil {
		return "", ""
	}
	return currentHand.Phase, currentHand.WhoIsNext()
}

func (g *Game) TallyScores() scoring.Scoreboard {
	if g.HasGameStarted() {
		scoreboard := scoring.NewScoreboard(g.Seating)
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
	return scoring.NewScoreboard([]string{})
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
