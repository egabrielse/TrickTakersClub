package entity

import (
	"common/list"
	"encoding/json"
	"fmt"
	"sheepshead"
	"sheepshead/hand"
	"time"

	"github.com/google/uuid"
)

type Session struct {
	ID           string               `json:"id"`           // unique ID of the session
	HostID       string               `json:"hostId"`       // ID of the host player
	Presence     map[string]time.Time `json:"presence"`     // IDs of players mapped to the last ping
	Created      time.Time            `json:"created"`      // timestamp in milliseconds
	LastUpdated  time.Time            `json:"-"`            // timestamp in milliseconds
	GameSettings *hand.GameSettings   `json:"gameSettings"` // game settings used to create a new game
	Game         *sheepshead.Game     `json:"-"`            // current game being played in the session
}

func NewSession(hostID string) *Session {
	return &Session{
		ID:           uuid.NewString(),
		HostID:       hostID,
		Presence:     map[string]time.Time{},
		Created:      time.Now(),
		LastUpdated:  time.Now(),
		GameSettings: hand.NewGameSettings(),
		Game:         nil,
	}
}

func (s *Session) GameInProgress() bool {
	return s.Game != nil
}

func (s *Session) KeepAlive(playerID string) {
	s.Presence[playerID] = time.Now()
}

func (s *Session) Join(playerID string) error {
	if s.GameInProgress() && !list.Contains(s.Game.PlayerOrder, playerID) {
		return fmt.Errorf("game in progress, closed to new players")
	} else if _, ok := s.Presence[playerID]; ok {
		// Player already in session, just update the timestamp
		s.KeepAlive(playerID)
		return nil
	} else if len(s.Presence) >= hand.PlayerCount {
		return fmt.Errorf("session is full")
	}
	s.KeepAlive(playerID)
	return nil
}

func (s *Session) Leave(playerID string) {
	delete(s.Presence, playerID)
}

func (s *Session) ListPresence() []string {
	presenceList := make([]string, 0, len(s.Presence))
	for playerID := range s.Presence {
		presenceList = append(presenceList, playerID)
	}
	return presenceList
}

func (s *Session) CleanupStalePresence(duration time.Duration) {
	now := time.Now()
	for k, v := range s.Presence {
		if now.Sub(v) > duration {
			delete(s.Presence, k)
		}
	}
}

func (s *Session) IsReadyToStart() bool {
	return len(s.Presence) >= hand.PlayerCount && !s.GameInProgress()
}

func (s *Session) StartGame(gameID string) (*sheepshead.Game, error) {
	if s.GameInProgress() {
		return nil, fmt.Errorf("game has already started")
	} else if len(s.Presence) < hand.PlayerCount {
		return nil, fmt.Errorf("not enough players to start the game")
	}
	players := make([]string, 0, len(s.Presence))
	for playerID := range s.Presence {
		players = append(players, playerID)
	}
	s.Game = sheepshead.NewGame(s.ID, s.HostID, players, s.GameSettings)
	return s.Game, nil
}

func (s *Session) ResumeGame(game *sheepshead.Game) (*sheepshead.Game, error) {
	if s.GameInProgress() {
		return nil, fmt.Errorf("game has already started")
	}
	s.Game = game
	// Reset the session ID to match the game ID
	s.ID = game.ID
	return s.Game, nil
}

func (s *Session) MarshalBinary() ([]byte, error) {
	return json.Marshal(s)
}

func (s *Session) UnmarshalBinary(data []byte) error {
	if err := json.Unmarshal(data, s); err != nil {
		return fmt.Errorf("failed to unmarshal session: %w", err)
	}
	// Update LastUpdated to current time after unmarshalling
	s.LastUpdated = time.Now()
	return nil
}
