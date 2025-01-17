package msg

import "main/domain/game/deck"

// Commands are messages sent by users to

var CommandType = struct {
	// Host updates game settings
	UpdateSettings string
	// User joins the game as a player
	SitDown string
	// Player leaves the game
	StandUp string
	// Start a new game
	StartGame string
	// End the current game
	EndGame string
	// Pick up the blind
	Pick string
	// Pass on the blind
	Pass string
	// Player buries cards
	Bury string
	// Picker calls a card (and partner)
	Call string
	// Picker chooses to go alone
	GoAlone string
	// Player plays a card
	PlayCard string
}{
	UpdateSettings: "update-settings",
	SitDown:        "sit-down",
	StandUp:        "stand-up",
	StartGame:      "start-game",
	EndGame:        "end-game",
	Pick:           "pick",
	Pass:           "pass",
	Bury:           "bury",
	Call:           "call",
	GoAlone:        "go-alone",
	PlayCard:       "play-card",
}

type UpdateSettingsParams struct {
	Key   string      `json:"key"`
	Value interface{} `json:"value"`
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
