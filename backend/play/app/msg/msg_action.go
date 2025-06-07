package msg

import (
	"sheepshead/deck"
)

type UpdateCallingMethodParams struct {
	CallingMethod string `json:"callingMethod"`
}

type UpdateDoubleOnTheBumpParams struct {
	DoubleOnTheBump bool `json:"doubleOnTheBump"`
}

type UpdateNoPickResolutionParams struct {
	NoPickResolution string `json:"noPickResolution"`
}

type BuryMessagePayload struct {
	Cards []*deck.Card `json:"cards"` // Cards that were buried
}

type CallMessagePayload struct {
	Card *deck.Card `json:"card"` // Card that was called
}

type PlayCardMessagePayload struct {
	Card *deck.Card `json:"card"` // Card that was played
}

type CallLastHandMessagePayload struct {
	PlayerID string `json:"playerId"` // ID of the player who called last hand
}
