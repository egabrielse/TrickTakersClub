package entity

import (
	"encoding/json"
	"fmt"
	"sheepshead"
	"sheepshead/hand"
	"sync"
	"time"

	"github.com/google/uuid"
)

// Session represents a game session, including the host, players, and game state.
type Session struct {
	ID             string               `json:"id"`             // unique ID of the session
	HostID         string               `json:"hostId"`         // ID of the host player
	Presence       map[string]time.Time `json:"presence"`       // IDs of players mapped to the last ping
	Created        time.Time            `json:"created"`        // timestamp in milliseconds
	LastUpdated    time.Time            `json:"lastUpdated"`    // timestamp in milliseconds
	GameInProgress bool                 `json:"gameInProgress"` // extracted from Session.Game - true if a game is currently in progress
	GameSettings   *hand.GameSettings   `json:"gameSettings"`   // extracted from Session.Game - settings for the game
	Game           *sheepshead.Game     `json:"-"`              // current game being played in the session
	mux            sync.RWMutex         `json:"-"`              // mutex to protect concurrent access
}

func NewSession(hostID string) *Session {
	id := uuid.New().String()
	game := sheepshead.NewGame()
	game.AddPlayer(hostID) // Automatically add the host to the game
	return &Session{
		ID:          id,
		HostID:      hostID,
		Presence:    map[string]time.Time{},
		Created:     time.Now(),
		LastUpdated: time.Now(),
		Game:        game,
		mux:         sync.RWMutex{},
	}
}

func (s *Session) keepAliveHelper(playerID string) {
	s.Presence[playerID] = time.Now()
}

func (s *Session) KeepAlive(playerID string) {
	s.mux.Lock()
	defer s.mux.Unlock()
	s.keepAliveHelper(playerID)
}

func (s *Session) Join(playerID string) error {
	s.mux.Lock()
	defer s.mux.Unlock()
	if _, ok := s.Presence[playerID]; ok {
		// Player already in session, just update the timestamp
		s.keepAliveHelper(playerID)
		return nil
	} else if s.Game.HasGameStarted() {
		if s.Game.IsPlayerSeated(playerID) {
			// Player is seated in game, just update the timestamp
			s.keepAliveHelper(playerID)
			return nil
		} else {
			// Game has started, but player is not seated
			return fmt.Errorf("game in progress, closed to new players")
		}
	} else if err := s.Game.AddPlayer(playerID); err != nil {
		// Error adding player to game
		return err
	} else {
		// Player successfully joined the game and therefore session
		s.keepAliveHelper(playerID)
		return nil
	}
}

func (s *Session) leaveHelper(playerID string) {
	// Remove player from game if it has not started yet and they are not the host
	// (host cannot leave the game)
	if !s.Game.HasGameStarted() && s.HostID != playerID {
		s.Game.DropPlayer(playerID)
	}
	// Remove player from session presence
	delete(s.Presence, playerID)
}

func (s *Session) Leave(playerID string) {
	s.mux.Lock()
	defer s.mux.Unlock()
	s.leaveHelper(playerID)
}

func (s *Session) ListPresentPlayers() []string {
	s.mux.RLock()
	defer s.mux.RUnlock()
	presenceList := make([]string, 0, len(s.Presence))
	for playerID := range s.Presence {
		presenceList = append(presenceList, playerID)
	}
	return presenceList
}

// Removes players who have not pinged in the given duration and returns their IDs.
func (s *Session) CleanupStalePresence(duration time.Duration) []string {
	s.mux.Lock()
	defer s.mux.Unlock()
	now := time.Now()
	removed := []string{}
	for k, v := range s.Presence {
		if now.Sub(v) > duration {
			s.leaveHelper(k)
			removed = append(removed, k)
		}
	}
	return removed
}

// Checks if the session is ready to start a game.
func (s *Session) SeatsAreFilled() bool {
	s.mux.RLock()
	defer s.mux.RUnlock()
	return s.Game.SeatsAreFilled()
}

func (s *Session) StartGame() error {
	s.mux.Lock()
	defer s.mux.Unlock()
	if err := s.Game.StartGame(); err != nil {
		return err
	}
	return nil
}

func (s *Session) ResumeGame(game *sheepshead.Game) error {
	s.mux.Lock()
	defer s.mux.Unlock()
	if s.Game.HasGameStarted() {
		return fmt.Errorf("game has already started")
	} else if !game.HasGameStarted() {
		return fmt.Errorf("cannot resume a game that has not started")
	}
	s.Game = game
	return nil
}

func (s *Session) ResetGame() {
	s.mux.Lock()
	defer s.mux.Unlock()
	if s.Game.HasGameStarted() {
		newGame := sheepshead.NewGame()
		newGame.Settings = s.Game.Settings // Preserve game settings
		newGame.Seating = s.Game.Seating   // Preserve seating arrangement
		s.Game = newGame
	}
}

func (s *Session) MarshalBinary() ([]byte, error) {
	// Lock the mutex for reading
	s.mux.RLock()
	defer s.mux.RUnlock()
	return json.Marshal(&Session{
		ID:             s.ID,
		HostID:         s.HostID,
		Presence:       s.Presence,
		Created:        s.Created,
		LastUpdated:    s.LastUpdated,
		GameSettings:   s.Game.Settings,
		GameInProgress: s.Game.HasGameStarted(),
	})
}

func (s *Session) UnmarshalBinary(data []byte) error {
	// Note: If unmarshalling a SessionRecord, we will not have the Game field populated.
	// And the saved GameSettings and GameInProgress will be ignored.
	return json.Unmarshal(data, s)
}
