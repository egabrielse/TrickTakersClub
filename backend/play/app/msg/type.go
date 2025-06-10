package msg

import "encoding/json"

type MessageType int

// Default message type, used for unrecognized messages
const MessageTypeUnknown = 0

// ### SYSTEM MESSAGES ###
// ### Messages used by the client/session workers to communicate with each other.
const (
	// Client worker is requesting to enter the lobby.
	MessageTypeEnter MessageType = 1000 + iota
	// Client worker is notifying the session worker that it is leaving the lobby.
	MessageTypeLeave
	// Ping sent by session worker to connected client workers
	MessageTypePing
	// Pong sent by client worker to acknowledge ping sent by session worker
	MessageTypePong
)

// ### ACTION MESSAGES ###
// ### Actions that players can take in the lobby or during the game.
// ### These are always generated client-side and sent to the server.
const (
	// Updates the game setting - calling method
	MessageTypeUpdateCallingMethod MessageType = 2000 + iota
	// Updates the game setting - bury resolution
	MessageTypeUpdateDoubleOnTheBump
	// Updates the game setting - pick resolution
	MessageTypeUpdateNoPickResolution
	// Host starts a new game.
	MessageTypeStartGame
	// Host ends the current game.
	MessageTypeEndGame
	// Player picks up the blind.
	MessageTypePick
	// Player passes on the blind.
	MessageTypePass
	// Player buries cards.
	MessageTypeBury
	// Picker calls a card (and partner).
	MessageTypeCall
	// Picker chooses to go alone.
	MessageTypeGoAlone
	// Player plays a card.
	MessageTypePlayCard
	// Player has called this as the last hand.
	MessageTypeCallLastHand
)

// ### EVENT MESSAGES ###
// ### Messages sent by the server worker to notify clients.
const (
	// Sent by session worker to notify clients of a timeout due to inactivity
	MessageTypeTimeout MessageType = 3000 + iota
	// Sent by the server to notify clients of an error.
	MessageTypeError
	// Sent by the server to newly joined clients to.
	MessageTypeWelcome
	// Notifies clients of a new player's presence in the lobby/game.
	MessageTypeEntered
	// Notifies clients of a player's departure from the lobby/game.
	MessageTypeLeft
	// Sent by the server to notify clients of updated game settings.
	MessageTypeSettingsUpdated
	// Game has started.
	MessageTypeGameOn
	// Game has ended.
	MessageTypeGameOver
	// Player has picked up the blind.
	MessageTypeBlindPicked
	// Picker has called a card (and partner).
	MessageTypeCardCalled
	// Picker has chosen to go alone.
	MessageTypeGoneAlone
	// Player has played a card.
	MessageTypeCardPlayed
	// Player has revealed their partner.
	MessageTypePartnerRevealed
	// Player has won a trick.
	MessageTypeTrickWon
	// Contains the results of the finished hand.
	MessageTypeHandDone
	// A new trick has started.
	MessageTypeNewTrick
	// Info about who's turn it is and what type of turn it is.
	MessageTypeUpNext
	// Informs users that the hand is moved into the no-pick scenario.
	MessageTypeNoPickHand
	// Cards dealt to a player
	MessageTypeDealHand
	// Cards picked up from the blind
	MessageTypePickedCards
	// Cards buried by the picker
	MessageTypeBuriedCards
	// Player has called this as the last hand.
	MessageTypeLastHand
)

// ### MISC MESSAGES ###
const (
	// Chat message between players.
	MessageTypeChat MessageType = 4000 + iota
)

// String returns the string representation of the MessageType.
func (mt MessageType) String() string {
	switch mt {
	default:
		return "unknown"
	// ### SYSTEM MESSAGES ###
	case MessageTypePing:
		return "ping"
	case MessageTypePong:
		return "pong"
	case MessageTypeEnter:
		return "enter"
	case MessageTypeLeave:
		return "leave"

	// ### ACTION MESSAGES ###
	case MessageTypeUpdateCallingMethod:
		return "update-calling-method"
	case MessageTypeUpdateDoubleOnTheBump:
		return "update-double-on-the-bump"
	case MessageTypeUpdateNoPickResolution:
		return "update-no-pick-resolution"
	case MessageTypeStartGame:
		return "start-game"
	case MessageTypeEndGame:
		return "end-game"
	case MessageTypePick:
		return "pick"
	case MessageTypePass:
		return "pass"
	case MessageTypeBury:
		return "bury"
	case MessageTypeCall:
		return "call"
	case MessageTypeGoAlone:
		return "go-alone"
	case MessageTypePlayCard:
		return "play-card"
	case MessageTypeCallLastHand:
		return "call-last-hand"

	// ### EVENT MESSAGES ###
	case MessageTypeTimeout:
		return "timeout"
	case MessageTypeError:
		return "error"
	case MessageTypeEntered:
		return "entered"
	case MessageTypeLeft:
		return "left"
	case MessageTypeWelcome:
		return "welcome"
	case MessageTypeSettingsUpdated:
		return "settings-updated"
	case MessageTypeGameOn:
		return "game-on"
	case MessageTypeGameOver:
		return "game-over"
	case MessageTypeBlindPicked:
		return "blind-picked"
	case MessageTypeCardCalled:
		return "card-called"
	case MessageTypeGoneAlone:
		return "gone-alone"
	case MessageTypeCardPlayed:
		return "card-played"
	case MessageTypePartnerRevealed:
		return "partner-revealed"
	case MessageTypeTrickWon:
		return "trick-won"
	case MessageTypeHandDone:
		return "hand-done"
	case MessageTypeNewTrick:
		return "new-trick"
	case MessageTypeUpNext:
		return "up-next"
	case MessageTypeNoPickHand:
		return "no-pick-hand"
	case MessageTypeDealHand:
		return "deal-hand"
	case MessageTypePickedCards:
		return "picked-cards"
	case MessageTypeBuriedCards:
		return "buried-cards"
	case MessageTypeLastHand:
		return "last-hand"

	// ### MISC MESSAGES ###
	case MessageTypeChat:
		return "chat"
	}
}

// MarshalJSON marshals the MessageType as a JSON string.
func (mt MessageType) MarshalJSON() ([]byte, error) {
	return json.Marshal(mt.String())
}

// UnmarshalJSON unmarshals a JSON string into a MessageType.
func (mt *MessageType) UnmarshalJSON(data []byte) error {
	var str string
	if err := json.Unmarshal(data, &str); err != nil {
		return err
	}
	switch str {
	// ### SYSTEM MESSAGES ###
	default:
		*mt = MessageTypeUnknown
	case "ping":
		*mt = MessageTypePing
	case "pong":
		*mt = MessageTypePong
	case "enter":
		*mt = MessageTypeEnter
	case "leave":
		*mt = MessageTypeLeave

	// ### ACTION MESSAGES ###
	case "update-calling-method":
		*mt = MessageTypeUpdateCallingMethod
	case "update-double-on-the-bump":
		*mt = MessageTypeUpdateDoubleOnTheBump
	case "update-no-pick-resolution":
		*mt = MessageTypeUpdateNoPickResolution
	case "start-game":
		*mt = MessageTypeStartGame
	case "end-game":
		*mt = MessageTypeEndGame
	case "pick":
		*mt = MessageTypePick
	case "pass":
		*mt = MessageTypePass
	case "bury":
		*mt = MessageTypeBury
	case "call":
		*mt = MessageTypeCall
	case "go-alone":
		*mt = MessageTypeGoAlone
	case "play-card":
		*mt = MessageTypePlayCard
	case "call-last-hand":
		*mt = MessageTypeCallLastHand

	// ### EVENT MESSAGES ###
	case "timeout":
		*mt = MessageTypeTimeout
	case "error":
		*mt = MessageTypeError
	case "entered":
		*mt = MessageTypeEntered
	case "left":
		*mt = MessageTypeLeft
	case "welcome":
		*mt = MessageTypeWelcome
	case "settings-updated":
		*mt = MessageTypeSettingsUpdated
	case "game-on":
		*mt = MessageTypeGameOn
	case "game-over":
		*mt = MessageTypeGameOver
	case "blind-picked":
		*mt = MessageTypeBlindPicked
	case "card-called":
		*mt = MessageTypeCardCalled
	case "gone-alone":
		*mt = MessageTypeGoneAlone
	case "card-played":
		*mt = MessageTypeCardPlayed
	case "partner-revealed":
		*mt = MessageTypePartnerRevealed
	case "trick-won":
		*mt = MessageTypeTrickWon
	case "hand-done":
		*mt = MessageTypeHandDone
	case "new-trick":
		*mt = MessageTypeNewTrick
	case "up-next":
		*mt = MessageTypeUpNext
	case "no-pick-hand":
		*mt = MessageTypeNoPickHand
	case "deal-hand":
		*mt = MessageTypeDealHand
	case "picked-cards":
		*mt = MessageTypePickedCards
	case "buried-cards":
		*mt = MessageTypeBuriedCards
	case "last-hand":
		*mt = MessageTypeLastHand

	// ### MISC MESSAGES ###
	case "chat":
		*mt = MessageTypeChat
	}
	return nil
}
