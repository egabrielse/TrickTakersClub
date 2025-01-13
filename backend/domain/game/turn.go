package game

import "main/domain/game/deck"

type UpNext struct {
	PlayerID string `json:"playerId"`
	Phase    string `json:"phase"`
}

type PickOrPassResult struct {
	PickerID    string       `json:"pickerId"`
	PickedCards []*deck.Card `json:"pickedCards"`
}

type BuryResult struct {
	BuriedCards []*deck.Card `json:"buriedCards"`
}

type CallResult struct {
	CalledCard *deck.Card `json:"calledCard"`
	CalledID   string     `json:"calledId"`
}

type PlayCardResult struct {
	PlayedCard   *deck.Card    `json:"playedCard"`
	TrickSummary *TrickSummary `json:"trickSummary"`
	HandSummary  *HandSummary  `json:"handSummary"`
}
