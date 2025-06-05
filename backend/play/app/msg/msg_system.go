package msg

func NewPingMessage() *Message {
	return NewMessage(SessionWorkerID, BroadcastRecipient, MessageTypePing, nil)
}

func NewPongMessage(senderID string) *Message {
	return NewMessage(senderID, SessionWorkerID, MessageTypePong, nil)
}

func NewTimeoutMessage() *Message {
	return NewMessage(SessionWorkerID, BroadcastRecipient, MessageTypeTimeout, nil)
}

type ErrorMessagePayload struct {
	Message string `json:"message"`
}

func NewErrorMessage(message string) *Message {
	return NewMessage(SessionWorkerID, BroadcastRecipient, MessageTypeError, &ErrorMessagePayload{Message: message})
}
