package msg

func NewPingMessage() *Message {
	return NewMessage(MessageTypePing, nil)
}

func NewPongMessage() *Message {
	return NewMessage(MessageTypePong, nil)
}

func NewEnterMessage() *Message {
	return NewMessage(MessageTypeEnter, nil)
}

func NewLeaveMessage() *Message {
	return NewMessage(MessageTypeLeave, nil)
}

func NewTimeoutMessage() *Message {
	return NewMessage(MessageTypeTimeout, nil)
}

func NewSessionFullMessage() *Message {
	return NewMessage(MessageTypeSessionFull, nil)
}
