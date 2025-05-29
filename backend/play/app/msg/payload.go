package msg

type ChatMessagePayload struct {
	Message string `json:"message"` // The chat message content
}

type WelcomePayload struct {
	HostID    string   `json:"hostId"`
	SessionID string   `json:"tableId"`
	Presence  []string `json:"presence"`
}

type PresencePayload struct {
	Presence []string `json:"presence"`
}

type ErrorMessage struct {
	Message string `json:"message"` // Error message content
}
