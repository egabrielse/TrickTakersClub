package summary

import (
	"main/domain/game/deck"
)

type PlayerSummary struct {
	Score  int `json:"score"`  // Player's score
	Points int `json:"points"` // Sum of points won
	Tricks int `json:"tricks"` // Count of tricks won
}

func NewPlayerSummary() *PlayerSummary {
	return &PlayerSummary{
		Score:  0,
		Points: 0,
		Tricks: 0,
	}
}

type BurySummary struct {
	Cards  []*deck.Card `json:"cards"`  // Cards in the bury
	Points int          `json:"points"` // Total points in the bury
}

type TrickSummary struct {
	TakerID  string       `json:"takerID"`  // ID of the player who took the trick
	Cards    []*deck.Card `json:"cards"`    // Cards played in the trick
	Points   int          `json:"points"`   // Total points in the trick
	Complete bool         `json:"complete"` // Whether the trick is complete
}

type HandSummary struct {
	Winners         []string                  `json:"winners"`         // IDs of the players who won the hand
	PlayerSummaries map[string]*PlayerSummary `json:"playerSummaries"` // Map of player IDs to summaries
	PickerID        string                    `json:"pickerID"`        // ID of the player who picked
	BurySummary     BurySummary               `json:"burySummary"`     // Summary of the picker's bury
	TrickSummaries  []*TrickSummary           `json:"trickSummaries"`  // Summaries of tricks
}

func NewHandSummary(playerIDs []string) *HandSummary {
	playerSums := map[string]*PlayerSummary{}
	for _, id := range playerIDs {
		playerSums[id] = NewPlayerSummary()
	}
	return &HandSummary{
		PlayerSummaries: playerSums,
		TrickSummaries:  []*TrickSummary{},
		BurySummary:     BurySummary{},
	}
}
