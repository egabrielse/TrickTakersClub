package message

var MessageType = struct {
	Timeout        string
	Chat           string
	Error          string
	State          string
	Joined         string
	TableFull      string
	UpdateSettings string
}{
	// TimeoutEvent is sent when the service times out due to inactivity
	Timeout: "timeout",
	// Chat messages between users
	Chat: "chat",
	// Error messages
	Error: "error",
	// Contains the current state of the table and game
	State: "state",
	// Sent when a user joins the table
	Joined: "joined",
	// Sent when the table is full
	TableFull: "table-full",
	// Sent by the host to change the game settings
	UpdateSettings: "update-settings",
}
