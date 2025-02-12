package msg

import (
	"main/domain/game"
	"main/domain/game/deck"
	"main/domain/game/summary"
)

var BroadcastType = struct {
	// When a player picks up the blind
	BlindPicked string
	// Card called by picker to select a partner
	CalledCard string
	// Card played by a player
	CardPlayed string
	// Text messages between users
	Chat string
	// Errors
	Error string
	// Picker chose to go it alone
	GoneAlone string
	// Partner has been revealed
	PartnerRevealed string
	// Settings Updated
	SettingsUpdated string
	// User becomes a player in the game
	SatDown string
	// User leaves the game
	StoodUp string
	// Game has started
	GameStarted string
	// Game has ended
	GameOver string
	// Trick has been won
	TrickDone string
	// Service timed out due to inactivity
	Timeout string
	// New trick has started
	NewTrick string
	// Sent to player who's turn it is
	UpNext string
}{
	BlindPicked:     "blind-picked",
	CalledCard:      "called-card",
	CardPlayed:      "card-played",
	Chat:            "chat",
	Error:           "error",
	GoneAlone:       "gone-alone",
	PartnerRevealed: "partner-revealed",
	SettingsUpdated: "settings-updated",
	SatDown:         "sat-down",
	StoodUp:         "stood-up",
	GameStarted:     "game-started",
	GameOver:        "game-over",
	TrickDone:       "trick-done",
	Timeout:         "timeout",
	NewTrick:        "new-trick",
	UpNext:          "up-next",
}

type BlindPickedData struct {
	PlayerID string `json:"playerId"`
}

func BlindPickedMessage(playerID string) (name string, data *BlindPickedData) {
	return BroadcastType.BlindPicked, &BlindPickedData{PlayerID: playerID}
}

type CalledCardData struct {
	Card *deck.Card `json:"card"`
}

func CalledCardMessage(card *deck.Card) (name string, data *CalledCardData) {
	return BroadcastType.CalledCard, &CalledCardData{Card: card}
}

type CardPlayedData struct {
	PlayerID string     `json:"playerId"`
	Card     *deck.Card `json:"card"`
}

func CardPlayedMessage(playerId string, card *deck.Card) (name string, data *CardPlayedData) {
	return BroadcastType.CardPlayed, &CardPlayedData{PlayerID: playerId, Card: card}
}

type ChatData struct {
	Message string `json:"message"`
}

func ChatMessage(message string) (name string, data *ChatData) {
	return BroadcastType.Chat, &ChatData{Message: message}
}

type GameOverData struct{}

func GameOverMessage() (name string, data *GameOverData) {
	return BroadcastType.GameOver, &GameOverData{}
}

type GameStartedData struct {
	PlayerOrder []string `json:"playerOrder"`
}

func GameStartedMessage(playerOrder []string) (name string, data *GameStartedData) {
	return BroadcastType.GameStarted, &GameStartedData{PlayerOrder: playerOrder}
}

type GoneAlonePayload struct{}

func GoneAloneMessage() (name string, data *GoneAlonePayload) {
	return BroadcastType.GoneAlone, &GoneAlonePayload{}
}

type PartnerRevealedData struct {
	PlayerID string `json:"playerId"`
}

func PartnerRevealedMessage(playerID string) (name string, data *PartnerRevealedData) {
	return BroadcastType.PartnerRevealed, &PartnerRevealedData{PlayerID: playerID}
}

type SatDownData struct {
	PlayerID string `json:"playerId"`
}

func SatDownMessage(playerID string) (name string, data *SatDownData) {
	return BroadcastType.SatDown, &SatDownData{PlayerID: playerID}
}

type SettingsUpdatedData struct {
	Settings *game.GameSettings `json:"settings"`
	Seating  []string           `json:"seating"`
}

func SettingsUpdatedMessage(settings *game.GameSettings, seating []string) (name string, data *SettingsUpdatedData) {
	return BroadcastType.SettingsUpdated, &SettingsUpdatedData{Settings: settings, Seating: seating}
}

type StoodUpData struct {
	PlayerID string `json:"playerId"`
}

func StoodUpMessage(playerID string) (name string, data *StoodUpData) {
	return BroadcastType.StoodUp, &StoodUpData{PlayerID: playerID}
}

type TimeoutData struct{}

func TimeoutMessage() (name string, data *TimeoutData) {
	return BroadcastType.Timeout, &TimeoutData{}
}

type TrickDoneData struct {
	TrickSummary *summary.TrickSummary `json:"trickSummary"`
	HandSummary  *summary.HandSummary  `json:"handSummary"`
}

func TrickDoneMessage(trickSum *summary.TrickSummary, handSum *summary.HandSummary) (name string, data *TrickDoneData) {
	return BroadcastType.TrickDone, &TrickDoneData{TrickSummary: trickSum, HandSummary: handSum}
}

// Who's turn is it and what phase are we in
type UpNextData struct {
	PlayerID       string   `json:"playerId"`
	Phase          string   `json:"phase"`
	NextTrickOrder []string `json:"nextTrickOrder"`
}

func UpNextMessage(phase, playerID string, nextTrickOrder []string) (name string, data *UpNextData) {
	return BroadcastType.UpNext, &UpNextData{PlayerID: playerID, Phase: phase, NextTrickOrder: nextTrickOrder}
}
