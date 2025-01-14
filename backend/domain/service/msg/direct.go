package msg

import (
	"main/domain/game/deck"
	"main/domain/service/state"
)

var DirectType = struct {
	// Errors
	Error string
	// Contains the current state of the table/game/hand
	Refresh string
	// Cards dealt to a player
	DealHand string
}{
	Error:    "error",
	Refresh:  "refresh",
	DealHand: "deal-hand",
}

// Contains the full details of the current state of the table and game
type RefreshPayload struct {
	TableID         string                 `json:"tableId"`
	HostID          string                 `json:"hostId"`
	GameState       *state.GameState       `json:"gameState"`
	HandState       *state.HandState       `json:"handState"`
	PlayerHandState *state.PlayerHandState `json:"playerHandState"`
}

// Sent to each player at the start of a new hand
type DealHandPayload struct {
	DealerID string       `json:"dealerId"`
	Cards    []*deck.Card `json:"cards"`
}
