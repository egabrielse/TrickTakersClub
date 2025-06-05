package msg

import (
	"sheepshead"
	"sheepshead/deck"
	"sheepshead/hand"
	"sheepshead/scoring"
)

func NewEnterMessage(senderID string) *Message {
	return NewMessage(senderID, SessionWorkerID, MessageTypeEnter, nil)
}

func NewLeaveMessage(senderID string) *Message {
	return NewMessage(senderID, SessionWorkerID, MessageTypeLeave, nil)
}

type ChatMessagePayload struct {
	Message string `json:"message"`
}

type WelcomePayload struct {
	HostID      string             `json:"hostId"`
	SessionID   string             `json:"sessionId"`
	Presence    []string           `json:"presence"`
	InProgress  bool               `json:"inProgress"`
	IsLastHand  bool               `json:"isLastHand"`
	DealerID    string             `json:"dealerId"`
	Scoreboard  scoring.Scoreboard `json:"scoreboard"`
	PlayerOrder []string           `json:"playerOrder"`
	Settings    *hand.GameSettings `json:"settings"`
	CalledCard  *deck.Card         `json:"calledCard"`
	Phase       string             `json:"phase"`
	UpNextID    string             `json:"upNextId"`
	PickerID    string             `json:"pickerId"`
	PartnerID   string             `json:"partnerId"`
	Tricks      []*hand.Trick      `json:"tricks"`
	Hand        []*deck.Card       `json:"hand"`
	Bury        []*deck.Card       `json:"bury"`
	NoPickHand  bool               `json:"noPickHand"`
}

func NewWelcomeMessage(receiverID, hostID, sessionID string, presence []string, settings *hand.GameSettings, game *sheepshead.Game) *Message {
	payload := &WelcomePayload{}
	payload.HostID = hostID
	payload.SessionID = sessionID
	payload.Presence = presence
	payload.Settings = settings
	if game != nil {
		payload.InProgress = true
		payload.IsLastHand = game.LastHand
		payload.IsLastHand = game.IsLastHand()
		payload.DealerID = game.WhoIsDealer()
		payload.Scoreboard = game.TallyScores()
		payload.PlayerOrder = game.PlayerOrder
		// State related to the current hand
		currentHand := game.GetCurrentHand()
		payload.CalledCard = currentHand.Call.GetCalledCard()
		payload.Phase = currentHand.Phase
		payload.UpNextID = currentHand.WhoIsNext()
		payload.PickerID = currentHand.Blind.PickerID
		payload.PartnerID = currentHand.Call.GetPartnerIfRevealed()
		payload.Tricks = currentHand.Tricks
		payload.NoPickHand = currentHand.Blind.IsNoPickHand()
		// Receiver is a player in the current game, include their hand and bury
		if hand := currentHand.PlayerHands.GetHand(receiverID); hand != nil {
			payload.Hand = hand
			if receiverID == currentHand.Blind.PickerID {
				// Only send buried cards to the picker
				payload.Bury = currentHand.Bury.Cards
			}
		}
	}
	return NewMessage(SessionWorkerID, receiverID, MessageTypeWelcome, payload)
}

type PresencePayload struct {
	Presence []string `json:"presence"`
}

func NewPresenceMessage(presence []string) *Message {
	return NewMessage(SessionWorkerID, BroadcastRecipient, MessageTypePresence, &PresencePayload{
		Presence: presence,
	})
}

type UpdateSettingsMessagePayload struct {
	Settings hand.GameSettings `json:"settings"`
}

func NewUpdateSettingsMessage(senderID string, settings hand.GameSettings) *Message {
	return NewMessage(senderID, SessionWorkerID, MessageTypeUpdateSettings, &UpdateSettingsMessagePayload{
		Settings: settings,
	})
}

type SettingsUpdatedMessagePayload struct {
	Settings hand.GameSettings `json:"settings"`
}

func NewSettingsUpdatedMessage(receiverID string, settings hand.GameSettings) *Message {
	return NewMessage(SessionWorkerID, receiverID, MessageTypeSettingsUpdated, &SettingsUpdatedMessagePayload{
		Settings: settings,
	})
}

func NewLastHandMessage(senderID string) *Message {
	return NewMessage(senderID, SessionWorkerID, MessageTypeLastHand, nil)
}
