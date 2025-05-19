package hand

import (
	"sheepshead/deck"
)

type PickResult struct {
	PickerID string       `json:"pickerId"`
	Blind    []*deck.Card `json:"blind"`
}

type PassResult struct {
	PickResult *PickResult `json:"pickResult"`
	AllPassed  bool        `json:"allPassed"`
}

type BuryResult struct {
	Bury          []*deck.Card   `json:"bury"`
	CallResult    *CallResult    `json:"callResult"`
	GoAloneResult *GoAloneResult `json:"goAloneResult"`
}

type GoAloneResult struct {
	Forced bool `json:"forced"`
}

type CallResult struct {
	CalledCard    *deck.Card     `json:"calledCard"`
	GoAloneResult *GoAloneResult `json:"goAloneResult"`
}

type PlayCardResult struct {
	TakerID       string     `json:"takerId"`       // Player ID of the player who took the trick
	PartnerID     string     `json:"partnerId"`     // Partner ID (if partner is revealed)
	PlayedCard    *deck.Card `json:"playedCard"`    // Card played by the player
	TrickComplete bool       `json:"trickComplete"` // Whether the trick is complete
	HandComplete  bool       `json:"handComplete"`  // Whether the hand is complete
}
