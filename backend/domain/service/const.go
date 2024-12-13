package service

import "time"

// TickerDuration is the duration after which the service will check for activity
const TickerDuration = time.Second * 30

// TimeoutDuration is the duration after which the service will be stopped if no activity is detected
const TimeoutDuration = time.Minute * 10

var MessageType = struct {
	// Service timed out due to inactivity
	Timeout string
	// Text messages between users
	Chat string
	// Errors
	Error string
	// Contains the current state of the table/game/hand
	Refresh string
	// User becomes a player in the game
	SatDown string
	// User leaves the game
	StoodUp string
	// New game created
	NewGame string
	// Game has started
	GameStarted string
	// Command to end the game
	GameOver string
}{
	Timeout:     "timeout",
	Chat:        "chat",
	Error:       "error",
	Refresh:     "refresh",
	SatDown:     "sat-down",
	StoodUp:     "stood-up",
	NewGame:     "new-game",
	GameStarted: "game-started",
	GameOver:    "game-over",
}

var CommandType = struct {
	// User joins the game as a player
	SitDown string
	// Player leaves the game
	StandUp string
	// Create a new game
	CreateGame string
	// End the current game
	EndGame string
}{
	SitDown:    "sit-down",
	StandUp:    "stand-up",
	CreateGame: "create-game",
	EndGame:    "end-game",
}
