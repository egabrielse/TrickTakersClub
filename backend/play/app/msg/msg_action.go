package msg

import "sheepshead/deck"

type BuryMessagePayload struct {
	Cards []*deck.Card `json:"cards"` // Cards that were buried
}

type CallMessagePayload struct {
	Card *deck.Card `json:"card"` // Card that was called
}

type PlayCardMessagePayload struct {
	Card *deck.Card `json:"card"` // Card that was played
}
