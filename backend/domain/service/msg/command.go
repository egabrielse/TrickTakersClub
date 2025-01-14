package msg

import "main/domain/game/deck"

// Commands are messages sent by users to

var CommandType = struct {
	// User joins the game as a player
	SitDown string
	// Player leaves the game
	StandUp string
	// Create a new game
	CreateGame string
	// End the current game
	EndGame string
	// Pick up the blind
	Pick string
	// Pass on the blind
	Pass string
	// Player buries cards
	Bury string
	// Player calls a card
	Call string
	// Player plays a card
	PlayCard string
}{
	SitDown:    "sit-down",
	StandUp:    "stand-up",
	CreateGame: "create-game",
	EndGame:    "end-game",
	Pick:       "pick",
	Pass:       "pass",
	Bury:       "bury",
	Call:       "call",
	PlayCard:   "play-card",
}

type BuryCommandParams struct {
	Cards []*deck.Card `json:"cards"`
}

type CallCommandParams struct {
	Card *deck.Card `json:"card"`
}

type PlayCardCommandParams struct {
	Card *deck.Card `json:"card"`
}
