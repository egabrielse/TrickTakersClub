package object

import "main/domain/game"

type TableState struct {
	TableID      string             `json:"tableId"`
	HostID       string             `json:"hostId"`
	GameSettings *game.GameSettings `json:"gameSettings"`
}
