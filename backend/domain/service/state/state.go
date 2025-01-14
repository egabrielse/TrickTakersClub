package state

import (
	"main/domain/game"
	"main/domain/game/deck"
)

type PlayerHandState struct {
	Hand []*deck.Card `json:"hand"` // Cards in the player's hand
	Bury []*deck.Card `json:"bury"` // Cards in the player's blind (if they are the picker)
}

type HandState struct {
	CalledCard *deck.Card    `json:"calledCard"` // Card called by the picker
	BlindSize  int           `json:"blindSize"`  // Number of cards in the blind
	Phase      string        `json:"phase"`      // Phase of the hand
	PickerID   string        `json:"pickerId"`   // Player who picked the blind
	PartnerID  string        `json:"partnerId"`  // Partner of the picker (only used when partner is revealed)
	Tricks     []*game.Trick `json:"tricks"`     // Tricks played in the hand
	UpNextID   string        `json:"upNextId"`   // ID of the player who is up next
}

type GameState struct {
	DealerID    string             `json:"dealerId"`    // ID of the dealer
	Scoreboard  game.Scoreboard    `json:"scoreboard"`  // Scoreboard
	PlayerOrder []string           `json:"playerOrder"` // Order of players at the table
	HandsPlayed int                `json:"handsPlayed"` // Number of hands played
	Settings    *game.GameSettings `json:"settings"`    // Game settings
}
