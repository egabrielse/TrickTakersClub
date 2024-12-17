package service

import (
	"main/domain/game"
	"main/domain/game/deck"
)

// Broadcast
type NewGamePayload struct {
	PlayerOrder []string           `json:"playerOrder"` // Order of players at the table
	Settings    *game.GameSettings `json:"settings"`    // Game settings
}

// Broadcast
type GameStartedPayload struct {
	Scoreboard  game.Scoreboard `json:"scoreboard"`  // Scoreboard
	PlayerOrder []string        `json:"playerOrder"` // Order of players at the table
}

// Direct - Contains the full details of the current state of the table and game
type RefreshPayload struct {
	TableID         string           `json:"tableId"`
	HostID          string           `json:"hostId"`
	GameState       *GameState       `json:"gameState"`
	HandState       *HandState       `json:"handState"`
	PlayerHandState *PlayerHandState `json:"playerHandState"`
}

// Direct - Sent to each player at the start of a new hand
type DealHandPayload struct {
	DealerIndex int          `json:"dealerIndex"`
	Cards       []*deck.Card `json:"cards"`
}

// Broadcast - Tells all players of who's turn is it
type UpNextPayload struct {
	PlayerID string `json:"playerId"`
	Phase    string `json:"phase"`
}

// Direct - Sent to the picker after picking
type PickPayload struct {
	Cards string `json:"phase"`
}

// Broadcast - Picker has called a card (and partner)
type CallPayload struct {
	CalledCard string `json:"calledCard"`
}

// Direct - Cards buried by the picker
type BuryPayload struct {
	BuriedCards string `json:"buriedCards"`
}
