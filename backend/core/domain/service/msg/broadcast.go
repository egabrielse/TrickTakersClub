package msg

import (
	"sheepshead/deck"
	"sheepshead/hand"
	"sheepshead/scoring"
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
	// Last hand of the game was called
	LastHand string
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
	TrickWon string
	// Hand is finished
	HandDone string
	// Service timed out due to inactivity
	Timeout string
	// New trick has started
	NewTrick string
	// Sent to player who's turn it is
	UpNext string
	// Leasters or Mosters hand is played
	NoPickHand string
}{
	BlindPicked:     "blind-picked",
	CalledCard:      "called-card",
	CardPlayed:      "card-played",
	Chat:            "chat",
	LastHand:        "last-hand",
	GoneAlone:       "gone-alone",
	PartnerRevealed: "partner-revealed",
	SettingsUpdated: "settings-updated",
	SatDown:         "sat-down",
	StoodUp:         "stood-up",
	GameStarted:     "game-started",
	GameOver:        "game-over",
	TrickWon:        "trick-won",
	HandDone:        "hand-done",
	Timeout:         "timeout",
	NewTrick:        "new-trick",
	UpNext:          "up-next",
	NoPickHand:      "no-pick-hand",
}

type BlindPickedData struct {
	PlayerID  string `json:"playerId"`
	ForcePick bool   `json:"forcePick"`
}

func BlindPickedMessage(playerID string, forced bool) (name string, data *BlindPickedData) {
	return BroadcastType.BlindPicked, &BlindPickedData{PlayerID: playerID, ForcePick: forced}
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

type LastHandStatusData struct {
	PlayerID string `json:"playerId"`
}

func LastHandMessage(playerID string) (name string, data *LastHandStatusData) {
	return BroadcastType.LastHand, &LastHandStatusData{PlayerID: playerID}
}

type GameOverData struct {
	Scoreboard scoring.Scoreboard `json:"scoreboard"`
}

func GameOverMessage(scoreboard scoring.Scoreboard) (name string, data *GameOverData) {
	return BroadcastType.GameOver, &GameOverData{Scoreboard: scoreboard}
}

type GameStartedData struct {
	PlayerOrder []string `json:"playerOrder"`
}

func GameStartedMessage(playerOrder []string) (name string, data *GameStartedData) {
	return BroadcastType.GameStarted, &GameStartedData{PlayerOrder: playerOrder}
}

type GoneAlonePayload struct {
	Forced bool `json:"forced"`
}

func GoneAloneMessage(forced bool) (name string, data *GoneAlonePayload) {
	return BroadcastType.GoneAlone, &GoneAlonePayload{Forced: forced}
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
	Settings *hand.GameSettings `json:"settings"`
}

func SettingsUpdatedMessage(settings *hand.GameSettings) (name string, data *SettingsUpdatedData) {
	return BroadcastType.SettingsUpdated, &SettingsUpdatedData{Settings: settings}
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

type TrickWonData struct {
	PlayerID string       `json:"playerId"`
	Blind    []*deck.Card `json:"blind"`
}

func TrickWonMessage(playerId string, blind []*deck.Card) (name string, data *TrickWonData) {
	return BroadcastType.TrickWon, &TrickWonData{PlayerID: playerId, Blind: blind}
}

type HandDoneData struct {
	Summary    *hand.HandSummary  `json:"summary"`
	Scoreboard scoring.Scoreboard `json:"scoreboard"`
}

func HandDoneMessage(summary *hand.HandSummary, scoreboard scoring.Scoreboard) (name string, data *HandDoneData) {
	return BroadcastType.HandDone, &HandDoneData{Summary: summary, Scoreboard: scoreboard}
}

type NewTrickData struct {
	NextTrickOrder []string `json:"nextTrickOrder"`
}

func NewTrickMessage(nextTrickOrder []string) (name string, data *NewTrickData) {
	return BroadcastType.NewTrick, &NewTrickData{NextTrickOrder: nextTrickOrder}
}

type UpNextData struct {
	PlayerID string `json:"playerId"`
	Phase    string `json:"phase"`
}

func UpNextMessage(phase, playerID string) (name string, data *UpNextData) {
	return BroadcastType.UpNext, &UpNextData{PlayerID: playerID, Phase: phase}
}

type NoPickHandData struct{}

func NoPickHandMessage() (name string, data *NoPickHandData) {
	return BroadcastType.NoPickHand, &NoPickHandData{}
}
