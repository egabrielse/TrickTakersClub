package game

import (
	"encoding/json"
	"main/domain/game/deck"
)

const (
	TurnTypePick  = "pick"
	TurnTypeBury  = "bury"
	TurnTypeCall  = "call"
	TurnTypePlay  = "play"
	TurnTypeScore = "score"
)

func NewNextTurn() *NextTurn {
	return &NextTurn{
		Cards: []*deck.Card{},
	}
}

type NextTurn struct {
	PlayerID  string       `json:"playerId"`
	TurnType  string       `json:"turnType"`
	Cards     []*deck.Card `json:"cards"`
	CanBlitz  bool         `json:"canBlitz"`
	BlindSize int          `json:"blindSize"`
}

type TurnArgs struct {
	Blitz bool         `json:"blitz"`
	Cards []*deck.Card `json:"cards"`
	Pick  bool         `json:"pick"`
}

func NewTurnResult() *TurnResult {
	return &TurnResult{
		PlayedCard:     nil,
		PickedCards:    []*deck.Card{},
		CalledCard:     nil,
		BuriedCards:    []*deck.Card{},
		BlitzCards:     []*deck.Card{},
		TrickCompleted: false,
		HandCompleted:  false,
		TrickSummary:   nil,
		HandSummary:    nil,
	}
}

type TurnResult struct {
	Picked         bool          `json:"picked"`
	Blitzed        bool          `json:"blitzed"`
	PickedCards    []*deck.Card  `json:"pickedCards"`
	PlayedCard     *deck.Card    `json:"playedCard"`
	CalledCard     *deck.Card    `json:"calledCard"`
	BuriedCards    []*deck.Card  `json:"buriedCards"`
	BlitzCards     []*deck.Card  `json:"blitzCards"`
	TrickCompleted bool          `json:"trickCompleted"`
	HandCompleted  bool          `json:"handCompleted"`
	TrickSummary   *TrickSummary `json:"trickSummary"`
	HandSummary    *HandSummary  `json:"handSummary"`
	NextTrick      *Trick        `json:"nextTrick"`
}

type Turn struct {
	PlayerID string      `json:"playerId"` // ID of player who took the turn
	TurnType string      `json:"turnType"` // Type of turn the player took (indicates content of args)
	Args     *TurnArgs   `json:"args"`     // Arguments for the turn
	Result   *TurnResult `json:"result"`   // Result of the turn
	NextTurn *NextTurn   `json:"nextTurn"` // Information about next turn
}

func (t *TurnResult) MarshalBinary() (data []byte, err error) {
	return json.Marshal(t)
}

func (t *TurnResult) UnmarshalBinary(data []byte) (err error) {
	return json.Unmarshal(data, t)
}
