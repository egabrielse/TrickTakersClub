package msg

const BroadcastRecipient = "*"

const SessionWorkerID = "manager"

var MessageType = struct {
	// Text messages between users
	Chat string
	// Client is requesting to join the session
	Enter string
	// Client has left the session
	Leave string
	// List of all clients present in the session
	Presence string
	// Ping message to check connected clients
	Ping string
	// Pong message to acknowledge ping
	Pong string
	// Service timed out due to inactivity
	Timeout string
	// Sent to newly connected client, contains session state
	Welcome string
}{
	Chat:     "chat",
	Enter:    "enter",
	Leave:    "leave",
	Presence: "presence",
	Ping:     "ping",
	Pong:     "pong",
	Timeout:  "timeout",
	Welcome:  "welcome",
}
