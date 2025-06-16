package msg

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Message struct {
	ID          string          `json:"id"`          // Unique message ID
	SenderID    string          `json:"senderId"`    // User id of sender
	ReceiverID  string          `json:"receiverId"`  // User id of receiver
	MessageType MessageType     `json:"messageType"` // Type of message
	Data        json.RawMessage `json:"data"`        // Message payload as raw JSON
	Timestamp   time.Time       `json:"timestamp"`   // Message timestamp
}

func NewMessage(messageType MessageType, data interface{}) *Message {
	raw, _ := json.Marshal(data)
	return &Message{
		ID:          uuid.New().String(),
		MessageType: messageType,
		Data:        raw,
		Timestamp:   time.Now(),
	}
}

func (m *Message) SetSenderID(id string) {
	m.SenderID = id
}

func (m *Message) SetReceiverID(id string) {
	m.ReceiverID = id
}

// IsSender returns true if the message was sent by the given sender ID.
func (m *Message) IsSender(id string) bool {
	return m.SenderID == id
}

// IsRecipient returns true if the message is intended for the given recipient ID.
func (m *Message) IsRecipient(id string) bool {
	return m.ReceiverID == BroadcastRecipient || m.ReceiverID == id
}
