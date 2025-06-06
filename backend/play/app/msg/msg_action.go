package msg

import (
	"sheepshead/deck"
	"sheepshead/hand"
)

type UpdateSettingsMessagePayload struct {
	Settings hand.GameSettings `json:"settings"` // New game settings to apply
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
