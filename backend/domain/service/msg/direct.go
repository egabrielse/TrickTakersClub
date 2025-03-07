package msg

import (
	"main/domain/game"
	"main/domain/game/deck"
	"main/domain/game/game_settings"
	"main/domain/game/hand"
	"main/domain/game/scoring"
)

var DirectType = struct {
	// Errors
	Error string
	// Contains the current state of the table/game/hand
	Initialize string
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
	Initialize:  "initialize",
}

type BuriedCardsData struct {
	Cards []*deck.Card `json:"cards"`
}

func BuriedCardsMessage(clientID string, cards []*deck.Card) (string, string, *BuriedCardsData) {
	return clientID, DirectType.BuriedCards, &BuriedCardsData{Cards: cards}
}

type DealHandData struct {
	DealerID  string       `json:"dealerId"`
	Cards     []*deck.Card `json:"cards"`
	PickOrder []string     `json:"pickOrder"`
}

func DealHandMessage(clientID, dealerID string, cards []*deck.Card, pickOrder []string) (string, string, *DealHandData) {
	return clientID, DirectType.DealHand, &DealHandData{DealerID: dealerID, Cards: cards, PickOrder: pickOrder}
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

type InitializeData struct {
	PlayerID    string                      `json:"playerId"`
	HostID      string                      `json:"hostId"`
	TableID     string                      `json:"tableId"`
	Seating     []string                    `json:"seating"`
	InProgress  bool                        `json:"inProgress"`
	LastHand    map[string]bool             `json:"lastHand"`
	DealerID    string                      `json:"dealerId"`
	Scoreboard  scoring.Scoreboard          `json:"scoreboard"`
	PlayerOrder []string                    `json:"playerOrder"`
	Settings    *game_settings.GameSettings `json:"settings"`
	CalledCard  *deck.Card                  `json:"calledCard"`
	Phase       string                      `json:"phase"`
	UpNextID    string                      `json:"upNextId"`
	PickerID    string                      `json:"pickerId"`
	PartnerID   string                      `json:"partnerId"`
	Tricks      []*hand.Trick               `json:"tricks"`
	Hand        []*deck.Card                `json:"hand"`
	Bury        []*deck.Card                `json:"bury"`
}

func InitializeMessage(tableID, hostID, clientID string, seating []string, settings *game_settings.GameSettings, game *game.Game) (string, string, *InitializeData) {
	data := &InitializeData{}
	data.PlayerID = clientID
	data.HostID = hostID
	data.TableID = tableID
	data.Seating = seating
	data.Settings = settings
	data.InProgress = false
	if game != nil {
		// Game is in progress, include game and hand state
		data.InProgress = true
		data.LastHand = game.LastHand
		data.DealerID = game.WhoIsDealer()
		data.Scoreboard = game.TallyScores()
		data.PlayerOrder = game.PlayerOrder
		// State related to the current hand
		currentHand := game.GetCurrentHand()
		data.CalledCard = currentHand.Call.GetCalledCard()
		data.Phase = currentHand.Phase
		data.UpNextID = currentHand.WhoIsNext()
		data.PickerID = currentHand.Blind.PickerID
		data.PartnerID = currentHand.Call.GetPartnerIfRevealed()
		data.Tricks = currentHand.Tricks

		// Client is a player in the current game, include their hand and bury
		if hand := currentHand.PlayerHands.GetHand(clientID); hand != nil {
			data.Hand = hand
			if clientID == currentHand.Blind.PickerID {
				// Only send buried cards to the picker
				data.Bury = currentHand.Bury.Cards
			}
		}
	}
	return clientID, DirectType.Initialize, data
}
