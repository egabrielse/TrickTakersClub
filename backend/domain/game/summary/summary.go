package summary

import (
	"main/domain/game/deck"
	"main/domain/game/hand"
)

type HandSummary struct {
	Winners     []string       `json:"winners"`     // IDs of the players who won the hand
	WinningTeam string         `json:"winningTeam"` // IDs of the players who won the hand
	PickerID    string         `json:"pickerId"`    // ID of the player who picked
	PartnerID   string         `json:"partnerId"`   // ID of the picker's partner
	OpponentIDs []string       `json:"opponentIds"` // IDs of the picker's opponents
	Tricks      []*hand.Trick  `json:"tricks"`      // Summaries of the tricks played
	Bury        []*deck.Card   `json:"bury"`        // Buried Cards
	Scores      map[string]int `json:"scores"`      // Map of player IDs to their scores
	PointsWon   map[string]int `json:"pointsWon"`   // Map of player IDs to their total points won
	TricksWon   map[string]int `json:"tricksWon"`   // Map of player IDs to their total tricks won
}

func NewHandSummary(playerIDs []string) *HandSummary {
	scores := map[string]int{}
	pointsWon := map[string]int{}
	tricksWon := map[string]int{}
	for _, id := range playerIDs {
		scores[id] = 0
		pointsWon[id] = 0
		tricksWon[id] = 0
	}
	return &HandSummary{
		Winners:     []string{},
		OpponentIDs: []string{},
		Tricks:      []*hand.Trick{},
		Bury:        []*deck.Card{},
		Scores:      scores,
		PointsWon:   pointsWon,
		TricksWon:   tricksWon,
	}
}
