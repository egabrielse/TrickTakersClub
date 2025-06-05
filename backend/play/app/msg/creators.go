package msg

func NewEnterMessage(senderID string) *Message {
	return NewMessage(senderID, AppID, MessageTypeEnter, nil)
}

func NewLeaveMessage(senderID string) *Message {
	return NewMessage(senderID, AppID, MessageTypeLeave, nil)
}

func NewPingMessage() *Message {
	return NewMessage(AppID, BroadcastRecipient, MessageTypePing, nil)
}

func NewPongMessage(senderID string) *Message {
	return NewMessage(senderID, AppID, MessageTypePong, nil)
}

func NewTimeoutMessage() *Message {
	return NewMessage(AppID, BroadcastRecipient, MessageTypeTimeout, nil)
}

func NewWelcomeMessage(receiverID string, sessionID string, hostID string, presence []string) *Message {
	payload := &WelcomePayload{
		HostID:    hostID,
		SessionID: sessionID,
		Presence:  presence,
	}
	return NewMessage(AppID, receiverID, MessageTypeWelcome, payload)
}

func NewPresenceMessage(presence []string) *Message {
	return NewMessage(AppID, BroadcastRecipient, MessageTypePresence, &PresencePayload{
		Presence: presence,
	})
}

func NewErrorMessage(message string) *Message {
	return NewMessage(AppID, BroadcastRecipient, MessageTypePing, &ErrorMessage{Message: message})
}
