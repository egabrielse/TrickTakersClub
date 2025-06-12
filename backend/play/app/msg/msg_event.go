package msg

import (
	"sheepshead"
	"sheepshead/deck"
	"sheepshead/hand"
	"sheepshead/scoring"
)

type ErrorMessagePayload struct {
	Message string `json:"message"`
}

func NewErrorMessage(message string) *Message {
	return NewMessage(MessageTypeError, &ErrorMessagePayload{Message: message})
}

type EnteredMessagePayload struct {
	PlayerID string   `json:"playerId"` // ID of the player who entered
	Seating  []string `json:"seating"`  // Current seating arrangement
}

func NewEnteredMessage(playerID string, seating []string) *Message {
	return NewMessage(
		MessageTypeEntered,
		&EnteredMessagePayload{PlayerID: playerID, Seating: seating},
	)
}

type LeftMessagePayload struct {
	PlayerID string   `json:"playerId"` // ID of the player who left
	Seating  []string `json:"seating"`  // Current seating arrangement
}

func NewLeftMessage(playerID string, seating []string) *Message {
	return NewMessage(
		MessageTypeLeft,
		&LeftMessagePayload{PlayerID: playerID, Seating: seating},
	)
}

type SettingsUpdatedMessagePayload struct {
	Settings *hand.GameSettings `json:"settings"` // Updated game settings
}

func NewSettingsUpdatedMessage(settings *hand.GameSettings) *Message {
	return NewMessage(MessageTypeSettingsUpdated, &SettingsUpdatedMessagePayload{
		Settings: settings,
	})
}

type WelcomePayload struct {
	HostID     string             `json:"hostId"`
	SessionID  string             `json:"sessionId"`
	Presence   []string           `json:"presence"`
	InProgress bool               `json:"inProgress"`
	IsLastHand bool               `json:"isLastHand"`
	DealerID   string             `json:"dealerId"`
	Scoreboard scoring.Scoreboard `json:"scoreboard"`
	Seating    []string           `json:"seating"`
	Settings   *hand.GameSettings `json:"settings"`
	CalledCard *deck.Card         `json:"calledCard"`
	Phase      string             `json:"phase"`
	UpNextID   string             `json:"upNextId"`
	PickerID   string             `json:"pickerId"`
	PartnerID  string             `json:"partnerId"`
	Tricks     []*hand.Trick      `json:"tricks"`
	Hand       []*deck.Card       `json:"hand"`
	Bury       []*deck.Card       `json:"bury"`
	NoPickHand bool               `json:"noPickHand"`
}

func NewWelcomePayload() *WelcomePayload {
	return &WelcomePayload{
		HostID:     "",
		SessionID:  "",
		Presence:   []string{},
		InProgress: false,
		IsLastHand: false,
		DealerID:   "",
		Scoreboard: scoring.Scoreboard{},
		Seating:    nil,
		Settings:   &hand.GameSettings{},
		CalledCard: nil,
		Phase:      "",
		UpNextID:   "",
		PickerID:   "",
		PartnerID:  "",
		Tricks:     []*hand.Trick{},
		Hand:       []*deck.Card{},
		Bury:       []*deck.Card{},
		NoPickHand: false,
	}
}

func NewWelcomeMessage(playerID, hostID, sessionID string, presence []string, game *sheepshead.Game) *Message {
	payload := NewWelcomePayload()
	payload.HostID = hostID
	payload.SessionID = sessionID
	payload.Presence = presence
	payload.InProgress = game.HasGameStarted()
	payload.Settings = game.Settings
	payload.IsLastHand = game.IsLastHand()
	payload.DealerID = game.WhoIsDealer()
	payload.Scoreboard = game.TallyScores()
	payload.Seating = game.Seating
	// State related to the current hand
	currentHand := game.GetCurrentHand()
	if currentHand != nil {
		payload.CalledCard = currentHand.Call.GetCalledCard()
		payload.Phase = currentHand.Phase
		payload.UpNextID = currentHand.WhoIsNext()
		payload.PickerID = currentHand.Blind.PickerID
		payload.PartnerID = currentHand.Call.GetPartnerIfRevealed()
		payload.Tricks = currentHand.Tricks
		payload.NoPickHand = currentHand.Blind.IsNoPickHand()
		// Receiver is a player in the current game, include their hand and bury
		if hand := currentHand.PlayerHands.GetHand(playerID); hand != nil {
			payload.Hand = hand
			if playerID == currentHand.Blind.PickerID {
				// Only send buried cards to the picker
				payload.Bury = currentHand.Bury.Cards
			}
		}
	}
	return NewMessage(MessageTypeWelcome, payload)
}

type GameOnMessagePayload struct {
	Seating []string `json:"seating"` // Order of players in the game
}

func NewGameOnMessage(seating []string) *Message {
	return NewMessage(MessageTypeGameOn, &GameOnMessagePayload{
		Seating: seating,
	})
}

type GameOverMessagePayload struct {
	Scoreboard scoring.Scoreboard `json:"scoreboard"` // Final scores of the game
}

func NewGameOverMessage(scoreboard scoring.Scoreboard) *Message {
	return NewMessage(
		MessageTypeGameOver,
		&GameOverMessagePayload{Scoreboard: scoreboard},
	)
}

type BlindPickedMessagePayload struct {
	PlayerID  string `json:"playerId"`  // ID of the player who picked
	ForcePick bool   `json:"forcePick"` // Indicates if the picker was forced to pick
}

func NewBlindPickedMessage(playerID string, forcePick bool) *Message {
	return NewMessage(
		MessageTypeBlindPicked,
		&BlindPickedMessagePayload{PlayerID: playerID, ForcePick: forcePick},
	)
}

type CardCalledMessagePayload struct {
	Card *deck.Card `json:"card"` // Card that was called
}

func NewCardCalledMessage(card *deck.Card) *Message {
	return NewMessage(
		MessageTypeCardCalled,
		&CardCalledMessagePayload{Card: card},
	)
}

type GoneAloneMessagePayload struct {
	Forced bool `json:"forced"` // Indicates if the picker was forced to go alone
}

func NewGoneAloneMessage(forced bool) *Message {
	return NewMessage(
		MessageTypeGoneAlone,
		&GoneAloneMessagePayload{Forced: forced},
	)
}

type CardPlayedMessagePayload struct {
	PlayerID string     `json:"playerId"` // ID of the player who played the card
	Card     *deck.Card `json:"card"`     // Card that was played
}

func NewCardPlayedMessage(playerID string, card *deck.Card) *Message {
	return NewMessage(
		MessageTypeCardPlayed,
		&CardPlayedMessagePayload{PlayerID: playerID, Card: card},
	)
}

type PartnerRevealedMessagePayload struct {
	PlayerID string `json:"playerId"` // ID of the player who revealed their partner
}

func NewPartnerRevealedMessage(playerID string) *Message {
	return NewMessage(
		MessageTypePartnerRevealed,
		&PartnerRevealedMessagePayload{PlayerID: playerID},
	)
}

type TrickWonMessagePayload struct {
	PlayerID string       `json:"playerId"`
	Blind    []*deck.Card `json:"blind"`
}

func NewTrickWonMessage(playerID string, blind []*deck.Card) *Message {
	return NewMessage(
		MessageTypeTrickWon,
		&TrickWonMessagePayload{PlayerID: playerID, Blind: blind},
	)
}

type HandDoneMessagePayload struct {
	Summary    *hand.HandSummary  `json:"summary"`    // Summary of the hand
	Scoreboard scoring.Scoreboard `json:"scoreboard"` // Updated scoreboard after the hand
}

func NewHandDoneMessage(summary *hand.HandSummary, scoreboard scoring.Scoreboard) *Message {
	return NewMessage(
		MessageTypeHandDone,
		&HandDoneMessagePayload{Summary: summary, Scoreboard: scoreboard},
	)
}

type StartTrickMessagePayload struct {
	NextTrickOrder []string `json:"nextTrickOrder"` // Order of players for the next trick
}

func NewStartTrickMessage(nextTrickOrder []string) *Message {
	return NewMessage(
		MessageTypeStartTrick,
		&StartTrickMessagePayload{NextTrickOrder: nextTrickOrder},
	)
}

type UpNextMessagePayload struct {
	PlayerID string `json:"playerId"` // ID of the player who is up next
	Phase    string `json:"phase"`    // Phase of the game (e.g., "pick", "play", etc.)
}

func NewUpNextMessage(phase string, playerID string) *Message {
	return NewMessage(
		MessageTypeUpNext,
		&UpNextMessagePayload{Phase: phase, PlayerID: playerID},
	)
}

type NoPickHandMessagePayload struct{}

func NewNoPickHandMessage() *Message {
	return NewMessage(
		MessageTypeNoPickHand,
		&NoPickHandMessagePayload{},
	)
}

type BuriedCardsMessagePayload struct {
	Cards []*deck.Card `json:"cards"` // Cards that were buried
}

func NewBuriedCardsMessage(cards []*deck.Card) *Message {
	return NewMessage(
		MessageTypeBuriedCards,
		&BuriedCardsMessagePayload{Cards: cards},
	)
}

type DealHandMessagePayload struct {
	DealerID  string       `json:"dealerId"`  // ID of the dealer
	Cards     []*deck.Card `json:"cards"`     // Cards dealt to the players
	PickOrder []string     `json:"pickOrder"` // Order in which players will pick cards
}

func NewDealHandMessage(dealerID string, cards []*deck.Card, pickOrder []string) *Message {
	return NewMessage(
		MessageTypeDealHand,
		&DealHandMessagePayload{DealerID: dealerID, Cards: cards, PickOrder: pickOrder},
	)
}

type PickedCardsMessagePayload struct {
	Cards []*deck.Card `json:"cards"` // Cards picked by the player
}

func NewPickedCardsMessage(cards []*deck.Card) *Message {
	return NewMessage(
		MessageTypePickedCards,
		&PickedCardsMessagePayload{Cards: cards},
	)
}

type LastHandMessagePayload struct {
	PlayerID string `json:"playerId"` // ID of the player who called last hand
}

func NewLastHandMessage(playerID string) *Message {
	return NewMessage(MessageTypeLastHand, &LastHandMessagePayload{
		PlayerID: playerID,
	})
}
