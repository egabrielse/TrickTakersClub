package game

import (
	"main/domain/game/deck"
)

func NewHandSummary(playerIDs []string) *HandSummary {
	scores := map[string]int{}
	for _, id := range playerIDs {
		scores[id] = 0
	}
	return &HandSummary{
		Scores:      scores,
		TrickSums:   []*TrickSummary{},
		BurySummary: BurySummary{},
	}
}

type BurySummary struct {
	Cards  []*deck.Card `json:"cards"`  // Cards in the bury
	Points int          `json:"points"` // Total points in the bury
}

type TrickSummary struct {
	TakerID string       `json:"takerID"` // ID of the player who took the trick
	Cards   []*deck.Card `json:"cards"`   // Cards played in the trick
	Points  int          `json:"points"`  // Total points in the trick
}

type HandSummary struct {
	Winners     []string        `json:"winners"`     // IDs of the players who won the hand
	Scores      map[string]int  `json:"scores"`      // Map of player IDs to scores
	PointsWon   map[string]int  `json:"pointsWon"`   // Map of player IDs to points won
	TricksWon   map[string]int  `json:"tricksWon"`   // Map of player IDs to tricks won
	PickerID    string          `json:"pickerID"`    // ID of the player who picked
	BurySummary BurySummary     `json:"burySummary"` // Summary of the picker's bury
	TrickSums   []*TrickSummary `json:"trickSums"`   // Summaries of tricks
}
