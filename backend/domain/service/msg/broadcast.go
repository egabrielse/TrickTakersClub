package msg

import "main/domain/game"

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
}{
	Timeout:     "timeout",
	Chat:        "chat",
	Error:       "error",
	SatDown:     "sat-down",
	StoodUp:     "stood-up",
	NewGame:     "new-game",
	GameStarted: "game-started",
	GameOver:    "game-over",
	UpNext:      "up-next",
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
