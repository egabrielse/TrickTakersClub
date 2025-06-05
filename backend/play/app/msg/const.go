package msg

const BroadcastRecipient = "*"

const AppID = "app"

// Text messages between users
const MessageTypeChat = "chat"

// Client is requesting to join the session
const MessageTypeEnter = "enter"

// Client has left the session
const MessageTypeLeave = "leave"

// List of all clients present in the session
const MessageTypePresence = "presence"

// Ping message to check connected clients
const MessageTypePing = "ping"

// Pong message to acknowledge ping
const MessageTypePong = "pong"

// Service timed out due to inactivity
const MessageTypeTimeout = "timeout"

// Sent to newly connected client, contains session state
const MessageTypeWelcome = "welcome"
