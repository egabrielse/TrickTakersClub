package msg

import (
	"encoding/json"
	"time"
)

type Message struct {
	SenderID    string      `json:"senderId"`   // User id of sender
	ReceiverID  string      `json:"receiverId"` // User id of receiver
	MessageType string      `json:"msgType"`    // Type of message
	Payload     interface{} `json:"payload"`    // Message payload
	Timestamp   time.Time   `json:"timestamp"`  // Message timestamp
}

func NewMessage(senderID string, receiverID string, msgType string, payload interface{}) *Message {
	raw, _ := json.Marshal(payload)
	return &Message{
		SenderID:    senderID,
		ReceiverID:  receiverID,
		MessageType: msgType,
		Payload:     raw,
		Timestamp:   time.Now(),
	}
}

func (m *Message) IsBroadcast() bool {
	return m.ReceiverID == BroadcastRecipient
}

func (m *Message) IsAction() bool {
	return m.ReceiverID == AppID
}

func (m *Message) MarshalBinary() (data []byte, err error) {
	return json.Marshal(m)
}

func (m *Message) UnmarshalBinary(data []byte) (err error) {
	return json.Unmarshal(data, m)
}
