package msg

import (
	"sheepshead/deck"
	"sheepshead/hand"
	"sheepshead/scoring"
)

type GameOnMessagePayload struct {
	PlayerOrder []string `json:"playerOrder"` // Order of players in the game
}

func NewGameOnMessagePayload(playerOrder []string) GameOnMessagePayload {
	return GameOnMessagePayload{
		PlayerOrder: playerOrder,
	}
}

type GameOverMessagePayload struct {
	Scoreboard scoring.Scoreboard `json:"scoreboard"` // Final scores of the game
}

func NewGameOverMessage(scoreboard scoring.Scoreboard) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeGameOver,
		&GameOverMessagePayload{Scoreboard: scoreboard},
	)
}

type BlindPickedMessagePayload struct {
	PickerID  string `json:"pickerId"`  // ID of the player who picked
	ForcePick bool   `json:"forcePick"` // Indicates if the picker was forced to pick
}

func NewBlindPickedMessage(pickerID string, forcePick bool) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeBlindPicked,
		&BlindPickedMessagePayload{PickerID: pickerID, ForcePick: forcePick},
	)
}

type CardCalledMessagePayload struct {
	PickerID   string `json:"pickerId"`   // ID of the player who picked
	CalledCard string `json:"calledCard"` // Card that was called
}

func NewCardCalledMessage(pickerID string, calledCard string) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeCardCalled,
		&CardCalledMessagePayload{PickerID: pickerID, CalledCard: calledCard},
	)
}

type GoneAloneMessagePayload struct {
	Forced bool `json:"forced"` // Indicates if the picker was forced to go alone
}

func NewGoneAloneMessage(forced bool) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeGoneAlone,
		&GoneAloneMessagePayload{Forced: forced},
	)
}

type CardPlayedMessagePayload struct {
	PlayerID string `json:"playerId"` // ID of the player who played the card
	Card     string `json:"card"`     // Card that was played
}

func NewCardPlayedMessage(playerID string, card string) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeCardPlayed,
		&CardPlayedMessagePayload{PlayerID: playerID, Card: card},
	)
}

type PartnerRevealedMessagePayload struct {
	PartnerID string `json:"partnerId"` // ID of the player who revealed their partner
}

func NewPartnerRevealedMessage(partnerID string) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypePartnerRevealed,
		&PartnerRevealedMessagePayload{PartnerID: partnerID},
	)
}

type TrickWonMessagePayload struct {
	PlayerID string       `json:"playerId"`
	Blind    []*deck.Card `json:"blind"`
}

func NewTrickWonMessage(playerID string, blind []*deck.Card) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
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
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeHandDone,
		&HandDoneMessagePayload{Summary: summary, Scoreboard: scoreboard},
	)
}

type NewTrickMessagePayload struct {
	NextTrickOrder []string `json:"nextTrickOrder"` // Order of players for the next trick
}

func NewNewTrickMessage(nextTrickOrder []string) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeNewTrick,
		&NewTrickMessagePayload{NextTrickOrder: nextTrickOrder},
	)
}

type UpNextMessagePayload struct {
	PlayerID string `json:"playerId"` // ID of the player who is up next
	Phase    string `json:"phase"`    // Phase of the game (e.g., "pick", "play", etc.)
}

func NewUpNextMessage(playerID string, phase string) *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeUpNext,
		&UpNextMessagePayload{PlayerID: playerID, Phase: phase},
	)
}

type NoPickHandMessagePayload struct{}

func NewNoPickHandMessage() *Message {
	return NewMessage(
		SessionWorkerID,
		BroadcastRecipient,
		MessageTypeNoPickHand,
		&NoPickHandMessagePayload{},
	)
}

type BuriedCardsMessagePayload struct {
	Cards []*deck.Card `json:"cards"` // Cards that were buried
}

func NewBuriedCardsMessage(receiverID string, cards []*deck.Card) *Message {
	return NewMessage(
		SessionWorkerID,
		receiverID,
		MessageTypeBuriedCards,
		&BuriedCardsMessagePayload{Cards: cards},
	)
}

type DealHandMessagePayload struct {
	DealerID  string       `json:"dealerId"`  // ID of the dealer
	Cards     []*deck.Card `json:"cards"`     // Cards dealt to the players
	PickOrder []string     `json:"pickOrder"` // Order in which players will pick cards
}

func NewDealHandMessage(receiverID, dealerID string, cards []*deck.Card, pickOrder []string) *Message {
	return NewMessage(
		SessionWorkerID,
		receiverID,
		MessageTypeDealHand,
		&DealHandMessagePayload{DealerID: dealerID, Cards: cards, PickOrder: pickOrder},
	)
}

type PickedCardsMessagePayload struct {
	Cards []*deck.Card `json:"cards"` // Cards picked by the player
}

func NewPickedCardsMessage(receiverID string, cards []*deck.Card) *Message {
	return NewMessage(
		SessionWorkerID,
		receiverID,
		MessageTypePickedCards,
		&PickedCardsMessagePayload{Cards: cards},
	)
}
