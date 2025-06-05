package msg

import "encoding/json"

type MessageType int

// ### SYSTEM MESSAGES ###
// ### Messages that are not directly related to game play.
const (
	// Default message type, used for unrecognized messages
	MessageTypeUnknown MessageType = iota
	// Ping sent by session worker to connected client workers
	MessageTypePing
	// Pong sent by client worker to acknowledge ping sent by session worker
	MessageTypePong
	// Sent by session worker to notify clients of a timeout due to inactivity
	MessageTypeTimeout
	// Sent by the server to notify clients of an error.
	MessageTypeError
)

// ### LOBBY MESSAGES ###
// ### Messages related to the lobby, such as joining/leaving the game and chat messages.
const (
	// User has entered the game.
	MessageTypeEnter MessageType = iota + 100
	// User has left the game.
	MessageTypeLeave
	// Chat message between players.
	MessageTypeChat
	// Sent by the server to newly joined clients to.
	MessageTypeWelcome
	// Contains the current presence of players in the game.
	MessageTypePresence
	// Sent by host to update the game settings.
	MessageTypeUpdateSettings
	// Sent by the server to notify clients of updated game settings.
	MessageTypeSettingsUpdated
	// Player has called this as the last hand.
	MessageTypeLastHand
)

// ### ACTION MESSAGES ###
// ### Messages sent by players to perform actions in the game.
const (
	// Host starts a new game.
	MessageTypeStartGame MessageType = iota + 200
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
)

// ### EVENT MESSAGES ###
// ### Messages sent by the server to notify clients of game events.
const (
	// Game has started.
	MessageTypeGameOn MessageType = iota + 300
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
)

func (mt MessageType) String() string {
	switch mt {
	// ### SYSTEM MESSAGES ###
	default:
		return "unknown"
	case MessageTypePing:
		return "ping"
	case MessageTypePong:
		return "pong"
	case MessageTypeTimeout:
		return "timeout"
	case MessageTypeError:
		return "error"
	// ### LOBBY MESSAGES ###
	case MessageTypeEnter:
		return "enter"
	case MessageTypeLeave:
		return "leave"
	case MessageTypeChat:
		return "chat"
	case MessageTypeWelcome:
		return "welcome"
	case MessageTypePresence:
		return "presence"
	case MessageTypeUpdateSettings:
		return "update-settings"
	case MessageTypeSettingsUpdated:
		return "settings-updated"
	case MessageTypeLastHand:
		return "last-hand"
		// ### ACTION MESSAGES ###
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
	// ### EVENT MESSAGES ###
	case MessageTypeGameOn:
		return "game-on"
	case MessageTypeGameOver:
		return "game-over"
	case MessageTypeBlindPicked:
		return "blind-picked"
	case MessageTypeCardCalled:
		return "called-card"
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
	}
}

func (mt MessageType) MarshalJSON() ([]byte, error) {
	return json.Marshal(mt.String())
}

func (mt *MessageType) UnmarshalJSON(data []byte) error {
	var str string
	if err := json.Unmarshal(data, &str); err != nil {
		return err
	} else {
		switch str {
		// ### SYSTEM MESSAGES ###
		default:
			*mt = MessageTypeUnknown
		case "ping":
			*mt = MessageTypePing
		case "pong":
			*mt = MessageTypePong
		case "timeout":
			*mt = MessageTypeTimeout
		case "error":
			*mt = MessageTypeError
		// ### LOBBY MESSAGES ###
		case "enter":
			*mt = MessageTypeEnter
		case "leave":
			*mt = MessageTypeLeave
		case "chat":
			*mt = MessageTypeChat
		case "welcome":
			*mt = MessageTypeWelcome
		case "presence":
			*mt = MessageTypePresence
		case "update-settings":
			*mt = MessageTypeUpdateSettings
		case "settings-updated":
			*mt = MessageTypeSettingsUpdated
		case "last-hand":
			*mt = MessageTypeLastHand
		// ### ACTION MESSAGES ###
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
		// ### EVENT MESSAGES ###
		case "game-on":
			*mt = MessageTypeGameOn
		case "game-over":
			*mt = MessageTypeGameOver
		case "blind-picked":
			*mt = MessageTypeBlindPicked
		case "called-card":
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
		}
		return nil
	}
}
