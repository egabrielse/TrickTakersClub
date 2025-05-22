package entity

import (
	"common/list"
	"encoding/json"
	"fmt"
	"sheepshead/hand"

	"github.com/google/uuid"
)

type Session struct {
	ID           string             `json:"id" redis:"id"`                     // unique ID of the session
	HostID       string             `json:"hostId" redis:"hostId"`             // ID of the host player
	PlayerIDs    []string           `json:"playerIds" redis:"playerIds"`       // list of player IDs
	Created      int64              `json:"created" redis:"created"`           // timestamp in milliseconds
	PassCode     string             `json:"passCode" redis:"passCode"`         // optional 5 digit code
	GameSettings *hand.GameSettings `json:"gameSettings" redis:"gameSettings"` // game settings
	GameStarted  bool               `json:"gameStarted" redis:"gameStarted"`   // true if the game has started
}

func NewSession(hostID string, passCode string, gameSettings *hand.GameSettings) *Session {
	return &Session{
		ID:           uuid.NewString(),
		HostID:       hostID,
		PlayerIDs:    []string{hostID},
		Created:      0,
		PassCode:     passCode,
		GameSettings: gameSettings,
		GameStarted:  false,
	}
}

func (s *Session) SetPassCode(passCode string) {
	s.PassCode = passCode
}

func (s *Session) Join(playerID string) error {
	if len(s.PlayerIDs) >= hand.PlayerCount {
		return fmt.Errorf("session is full")
	} else if list.Contains(s.PlayerIDs, playerID) {
		return nil // Player already in session, no need to add again
	}
	s.PlayerIDs = append(s.PlayerIDs, playerID)
	return nil
}

func (s *Session) Leave(playerID string) error {
	if s.GameStarted {
		return fmt.Errorf("game has already started")
	} else if playerID == s.HostID {
		return fmt.Errorf("host cannot leave the session")
	}
	s.PlayerIDs = list.Filter(s.PlayerIDs, func(id string) bool {
		return id != playerID
	})
	return nil
}

func (s *Session) IsReadyToStart() bool {
	return len(s.PlayerIDs) >= hand.PlayerCount && !s.GameStarted
}

func (s *Session) StartGame() error {
	if s.GameStarted {
		return fmt.Errorf("game has already started")
	} else if len(s.PlayerIDs) < hand.PlayerCount {
		return fmt.Errorf("not enough players to start the game")
	}
	s.GameStarted = true
	return nil
}

func (s *Session) MarshalBinary() ([]byte, error) {
	return json.Marshal(s)
}

func (s *Session) UnmarshalBinary(data []byte) error {
	return json.Unmarshal(data, s)
}
