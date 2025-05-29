package msg

func NewPingMessage() *Message {
	return NewMessage(SessionWorkerID, BroadcastRecipient, MessageType.Ping, nil)
}

func NewTimeoutMessage() *Message {
	return NewMessage(SessionWorkerID, BroadcastRecipient, MessageType.Ping, nil)
}

func NewWelcomeMessage(receiverID string, sessionID string, hostID string, presence []string) *Message {
	payload := &WelcomePayload{
		HostID:    hostID,
		SessionID: sessionID,
		Presence:  presence,
	}
	return NewMessage(SessionWorkerID, receiverID, MessageType.Welcome, payload)
}

func NewPresenceMessage(presence []string) *Message {
	payload := &PresencePayload{
		Presence: presence,
	}
	return NewMessage(SessionWorkerID, BroadcastRecipient, MessageType.Presence, payload)
}

func NewErrorMessage(message string) *Message {
	return NewMessage(SessionWorkerID, BroadcastRecipient, MessageType.Ping, &ErrorMessage{Message: message})
}
