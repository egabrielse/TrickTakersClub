package entity

import (
	"encoding/json"
	"sheepshead"
)

type GameRecord struct {
	ID     string `json:"id"`     // unique ID of the game
	HostID string `json:"hostId"` // ID of the host player
	sheepshead.Game
}

func NewGameRecord(id string, hostID string, game sheepshead.Game) *GameRecord {
	return &GameRecord{
		ID:     id,
		HostID: hostID,
		Game:   game,
	}
}

func (g *GameRecord) SetGame(id string, hostID string, game sheepshead.Game) {
	g.ID = id
	g.HostID = hostID
	g.Game = game
}

func (g *GameRecord) MarshalBinary() ([]byte, error) {
	return json.Marshal(g)
}

func (g *GameRecord) UnmarshalBinary(data []byte) error {
	// Ensure Game is initialized so embedded fields can be unmarshaled correctly
	return json.Unmarshal(data, g)
}
