package msg

import (
	"encoding/json"
	"time"
)

type Message struct {
	SenderID    string      `json:"senderId"`    // User id of sender
	ReceiverID  string      `json:"receiverId"`  // User id of receiver
	MessageType MessageType `json:"messageType"` // Type of message
	Payload     interface{} `json:"payload"`     // Message payload
	Timestamp   time.Time   `json:"timestamp"`   // Message timestamp
}

func NewMessage(senderID string, receiverID string, messageType MessageType, payload interface{}) *Message {
	raw, _ := json.Marshal(payload)
	return &Message{
		SenderID:    senderID,
		ReceiverID:  receiverID,
		MessageType: messageType,
		Payload:     raw,
		Timestamp:   time.Now(),
	}
}

// IsRecipient returns true if the message is intended for the given recipient ID.
func (m *Message) IsRecipient(id string) bool {
	return m.ReceiverID == BroadcastRecipient || m.ReceiverID == id
}

func (m *Message) MarshalJSON() (data []byte, err error) {
	return json.Marshal(m)
}

func (m *Message) UnmarshalJSON(data []byte) (err error) {
	return json.Unmarshal(data, m)
}
