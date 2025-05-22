package message

import (
	"encoding/json"
	"time"
)

type Message struct {
	SenderID    string          `json:"senderId"`   // User id of sender
	ReceiverID  string          `json:"receiverId"` // User id of receiver (empty if broadcast)
	MessageType string          `json:"msgType"`    // Type of message
	Payload     json.RawMessage `json:"payload"`    // Message payload
	Timestamp   int64           `json:"timestamp"`  // Message timestamp in milliseconds
}

func NewMessage(senderID string, receiverID string, msgType string, payload json.RawMessage) *Message {
	return &Message{
		SenderID:    senderID,
		ReceiverID:  receiverID,
		MessageType: msgType,
		Payload:     payload,
		Timestamp:   time.Now().UnixMilli(),
	}
}

func (m *Message) IsBroadcast() bool {
	return m.ReceiverID == ""
}

func (m *Message) SetReceiver(receiverID string) {
	m.ReceiverID = receiverID
}

func (m *Message) MarshalBinary() (data []byte, err error) {
	return json.Marshal(m)
}

func (m *Message) UnmarshalBinary(data []byte) (err error) {
	return json.Unmarshal(data, m)
}
