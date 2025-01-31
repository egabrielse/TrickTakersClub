package game

import (
	"main/domain/game/deck"
	"main/domain/game/summary"
)

type PickOrPassResult struct {
	PickerID string       `json:"pickerId"`
	Blind    []*deck.Card `json:"blind"`
}

type BuryResult struct {
	Bury       []*deck.Card `json:"bury"`
	CallResult *CallResult  `json:"callResult"`
	GoneAlone  bool         `json:"goneAlone"`
}

type CallResult struct {
	CalledCard *deck.Card `json:"calledCard"`
}

type GoAloneResult struct{}

type PlayCardResult struct {
	PartnerID    string                `json:"partnerId"`    // Partner ID (if partner is revealed)
	PlayedCard   *deck.Card            `json:"playedCard"`   // Card played by the player
	TrickSummary *summary.TrickSummary `json:"trickSummary"` // Summary of the trick (if done)
	HandSummary  *summary.HandSummary  `json:"handSummary"`  // Summary of the hand (if done)
}
