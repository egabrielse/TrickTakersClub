package hand

import (
	"main/domain/game/deck"
)

type HandSummary struct {
	Winners           []string       `json:"winners"`           // IDs of the players who won the hand
	PickerID          string         `json:"pickerId"`          // ID of the player who picked
	PartnerID         string         `json:"partnerId"`         // ID of the picker's partner
	OpponentIDs       []string       `json:"opponentIds"`       // IDs of the picker's opponents
	Tricks            []*Trick       `json:"tricks"`            // Summaries of the tricks played
	Bury              []*deck.Card   `json:"bury"`              // Buried Cards
	Payouts           map[string]int `json:"payouts"`           // Map of player IDs to their payouts
	PayoutMultipliers []string       `json:"payoutMultipliers"` // List of multipliers applied to the payouts
	Scores            map[string]int `json:"scores"`            // Map of player IDs to their total scores
	PointsWon         map[string]int `json:"pointsWon"`         // Map of player IDs to their total points won
	TricksWon         map[string]int `json:"tricksWon"`         // Map of player IDs to their total tricks won
	ScoringMethod     string         `json:"scoringMethod"`     // Method used to score the hand
}

func NewHandSummary(playerIDs []string) *HandSummary {
	payouts := map[string]int{}
	pointsWon := map[string]int{}
	tricksWon := map[string]int{}
	for _, id := range playerIDs {
		payouts[id] = 0
		pointsWon[id] = 0
		tricksWon[id] = 0
	}
	return &HandSummary{
		Winners:           []string{},
		OpponentIDs:       []string{},
		Tricks:            []*Trick{},
		Bury:              []*deck.Card{},
		Payouts:           payouts,
		PayoutMultipliers: []string{},
		PointsWon:         pointsWon,
		TricksWon:         tricksWon,
	}
}
