package msg

import (
	"main/domain/game"
	"main/domain/game/deck"
	"main/domain/game/summary"
)

var BroadcastType = struct {
	// Service timed out due to inactivity
	Timeout string
	// Text messages between users
	Chat string
	// Errors
	Error string
	// User becomes a player in the game
	SatDown string
	// User leaves the game
	StoodUp string
	// New game created
	NewGame string
	// Game has started
	GameStarted string
	// Game has ended
	GameOver string
	// Sent to player who's turn it is
	UpNext string
	// When a player picks up the blind
	BlindPicked string
	// Card called by picker to select a partner
	CalledCard string
	// Card played by a player
	CardPlayed string
	// Partner has been revealed
	PartnerRevealed string
	// Picker chose to go it alone
	GoAlone string
	// Trick has been won
	TrickDone string
	// Hand has been won
	HandDone string
}{
	Timeout:         "timeout",
	Chat:            "chat",
	Error:           "error",
	SatDown:         "sat-down",
	StoodUp:         "stood-up",
	NewGame:         "new-game",
	GameStarted:     "game-started",
	GameOver:        "game-over",
	UpNext:          "up-next",
	BlindPicked:     "blind-picked",
	CalledCard:      "called-card",
	CardPlayed:      "card-played",
	PartnerRevealed: "partner-revealed",
	GoAlone:         "go-alone",
	TrickDone:       "trick-done",
	HandDone:        "hand-done",
}

// Payload for a new game
type NewGamePayload struct {
	PlayerOrder []string           `json:"playerOrder"` // Order of players at the table
	Settings    *game.GameSettings `json:"settings"`    // Game settings
}

// Payload for when a game has started
type GameStartedPayload struct {
	Scoreboard  game.Scoreboard `json:"scoreboard"`  // Scoreboard
	PlayerOrder []string        `json:"playerOrder"` // Order of players at the table
}

// Who's turn is it and what phase are we in
type UpNextPayload struct {
	PlayerID string `json:"playerId"`
	Phase    string `json:"phase"`
}

type BlindPickedPayload struct {
	PlayerID string `json:"playerId"`
}

type CalledCardPayload struct {
	Alone bool       `json:"alone"`
	Card  *deck.Card `json:"card"`
}

type CardPlayedPayload struct {
	Card *deck.Card `json:"card"`
}

type PartnerRevealedPayload struct {
	PartnerID string `json:"partnerId"`
}

type TrickDonePayload struct {
	TrickSummary *summary.TrickSummary `json:"trickSummary"`
}

type HandDonePayload struct {
	HandSummary *summary.HandSummary `json:"handSummary"`
}
