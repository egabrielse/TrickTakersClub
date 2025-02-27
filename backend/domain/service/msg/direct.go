package msg

import (
	"main/domain/game"
	"main/domain/game/deck"
	"main/domain/game/hand"
	"main/domain/game/summary"
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

type InitializeData struct {
	PlayerID     string                  `json:"playerId"`
	HostID       string                  `json:"hostId"`
	TableID      string                  `json:"tableId"`
	Seating      []string                `json:"seating"`
	InProgress   bool                    `json:"inProgress"`
	DealerID     string                  `json:"dealerId"`
	Scoreboard   game.Scoreboard         `json:"scoreboard"`
	PlayerOrder  []string                `json:"playerOrder"`
	HandsPlayed  int                     `json:"handsPlayed"`
	Settings     *game.GameSettings      `json:"settings"`
	CalledCard   *deck.Card              `json:"calledCard"`
	Phase        string                  `json:"phase"`
	UpNextID     string                  `json:"upNextId"`
	PickerID     string                  `json:"pickerId"`
	PartnerID    string                  `json:"partnerId"`
	Summaries    []*summary.TrickSummary `json:"summaries"`
	CurrentTrick *hand.Trick             `json:"currentTrick"`
	Hand         []*deck.Card            `json:"hand"`
	Bury         []*deck.Card            `json:"bury"`
}

func InitializeMessage(tableID, hostID, clientID string, seating []string, settings *game.GameSettings, game *game.Game) (string, string, *InitializeData) {
	data := &InitializeData{}
	data.PlayerID = clientID
	data.HostID = hostID
	data.TableID = tableID
	data.Seating = seating
	data.Settings = settings
	data.InProgress = false
	if game != nil {
		// Game is in progress, include game state
		data.InProgress = true
		data.DealerID = game.WhoIsDealer()
		data.Scoreboard = game.Scoreboard
		data.PlayerOrder = game.PlayerOrder
		data.HandsPlayed = game.HandsPlayed

		// Hand is in progress, include hand state
		if game.HandInProgress() {
			data.CalledCard = game.Call.GetCalledCard()
			data.Phase = game.Phase
			data.UpNextID = game.WhoIsNext()
			data.PickerID = game.Blind.PickerID
			data.PartnerID = game.Call.GetPartnerIfRevealed()
			data.CurrentTrick = game.Play.GetCurrentTrick()
			data.Summaries = game.Play.SummarizeTricks()

			// Client is a player in the current game, include their hand and bury
			if hand := game.Players.GetHand(clientID); hand != nil {
				data.Hand = hand
				if clientID == game.Blind.PickerID {
					// Only send buried cards to the picker
					data.Bury = game.Bury.Cards
				}
			}
		}
	}
	return clientID, DirectType.Initialize, data
}
