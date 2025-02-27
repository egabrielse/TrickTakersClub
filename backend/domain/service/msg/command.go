package msg

import (
	"encoding/json"
	"main/domain/game/deck"
)

// Commands are messages sent by users to

var CommandType = struct {
	// Player buries cards
	Bury string
	// Picker calls a card (and partner)
	Call string
	// Picker chooses to go alone
	GoAlone string
	// End the current game
	EndGame string
	// Pass on the blind
	Pass string
	// Player plays a card
	PlayCard string
	// Pick up the blind
	Pick string
	// Start a new game
	StartGame string
	// User joins the game as a player
	SitDown string
	// Player leaves the game
	StandUp string
	// Updates the game settings - calling method
	UpdateCallingMethod string
	// Updates the game settings - bury resolution
	UpdateDoubleOnTheBump string
	// Updates the game settings - auto deal
	UpdateAutoDeal string
	// Updates the game settings - pick resolution
	UpdateNoPickResolution string
}{
	Bury:                   "bury",
	Call:                   "call",
	GoAlone:                "go-alone",
	EndGame:                "end-game",
	Pass:                   "pass",
	PlayCard:               "play-card",
	Pick:                   "pick",
	StartGame:              "start-game",
	SitDown:                "sit-down",
	StandUp:                "stand-up",
	UpdateCallingMethod:    "update-calling-method",
	UpdateDoubleOnTheBump:  "update-double-on-the-bump",
	UpdateAutoDeal:         "update-auto-deal",
	UpdateNoPickResolution: "update-no-pick-resolution",
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

type UpdateAutoDealParams struct {
	AutoDeal bool `json:"autoDeal"`
}

type UpdateCallingMethodParams struct {
	CallingMethod string `json:"callingMethod"`
}

type UpdateDoubleOnTheBumpParams struct {
	DoubleOnTheBump bool `json:"doubleOnTheBump"`
}

type UpdateNoPickResolutionParams struct {
	NoPickResolution string `json:"noPickResolution"`
}

func ExtractParams[T any](data interface{}) (*T, error) {
	params := new(T)
	if err := json.Unmarshal([]byte(data.(string)), params); err != nil {
		return nil, err
	}
	return params, nil
}
