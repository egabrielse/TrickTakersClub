package msg

import (
	"main/domain/game"
	"main/domain/game/deck"
	"main/domain/game/hand"
)

var DirectType = struct {
	// Errors
	Error string
	// Contains the current state of the table/game/hand
	Refresh string
	// Cards dealt to a player
	DealHand string
	// Cards picked up from the blind
	PickedCards string
	// Cards buried by the picker
	BuriedCards string
}{
	BuriedCards: "buried-cards",
	DealHand:    "deal-hand",
	Error:       "error",
	PickedCards: "picked-cards",
	Refresh:     "refresh",
}

type BuriedCardsData struct {
	Cards []*deck.Card `json:"cards"`
}

func BuriedCardsMessage(clientID string, cards []*deck.Card) (string, string, *BuriedCardsData) {
	return clientID, DirectType.BuriedCards, &BuriedCardsData{Cards: cards}
}

type DealHandData struct {
	DealerID string       `json:"dealerId"`
	Cards    []*deck.Card `json:"cards"`
}

func DealHandMessage(clientID, dealerID string, cards []*deck.Card) (string, string, *DealHandData) {
	return clientID, DirectType.DealHand, &DealHandData{DealerID: dealerID, Cards: cards}
}

type ErrorData struct {
	Message string `json:"message"`
}

func ErrorMessage(clientID, message string) (string, string, *ErrorData) {
	return clientID, DirectType.Error, &ErrorData{Message: message}
}

type PickedCardsData struct {
	Cards []*deck.Card `json:"cards"`
}

func PickedCardsMessage(clientID string, cards []*deck.Card) (string, string, *PickedCardsData) {
	return clientID, DirectType.PickedCards, &PickedCardsData{Cards: cards}
}

type RefreshData struct {
	Seating        []string `json:"seating"`
	GameInProgress bool     `json:"gameInProgress"`
	// Game state
	DealerID    string             `json:"dealerId"`
	Scoreboard  game.Scoreboard    `json:"scoreboard"`
	PlayerOrder []string           `json:"playerOrder"`
	HandsPlayed int                `json:"handsPlayed"`
	Settings    *game.GameSettings `json:"settings"`
	// Hand state
	CalledCard *deck.Card    `json:"calledCard"`
	BlindSize  int           `json:"blindSize"`
	Phase      string        `json:"phase"`
	UpNextID   string        `json:"upNextId"`
	PickerID   string        `json:"pickerId"`
	PartnerID  string        `json:"partnerId"`
	Tricks     []*hand.Trick `json:"tricks"`
	// Player's hand state
	ClientIsPlayer bool         `json:"clientIsPlayer"`
	Hand           []*deck.Card `json:"hand"`
	Bury           []*deck.Card `json:"bury"`
}

func RefreshMessage(clientID string, seating []string, settings *game.GameSettings, game *game.Game) (string, string, *RefreshData) {
	data := &RefreshData{}
	data.Seating = seating
	data.Settings = settings
	if game != nil {
		// Game is in progress, include game state
		data.GameInProgress = true
		data.DealerID = game.WhoIsDealer()
		data.Scoreboard = game.Scoreboard
		data.PlayerOrder = game.PlayerOrder
		data.HandsPlayed = game.HandsPlayed
		data.BlindSize = game.Settings.GetBlindSize()

		// Hand is in progress, include hand state
		if game.HandInProgress() {
			data.CalledCard = game.Call.GetCalledCard()
			data.Phase = game.Phase
			data.UpNextID = game.WhoIsNext()
			data.PickerID = game.Blind.PickerID
			data.PartnerID = game.Call.GetPartnerIfRevealed()
			data.Tricks = game.Play.Tricks

			// Client is a player in the current game, include their hand and bury
			if hand := game.Players.GetHand(clientID); hand != nil {
				data.Hand = hand
				data.Bury = game.Bury.Cards
			}
		}
	}
	return clientID, DirectType.Refresh, data
}
