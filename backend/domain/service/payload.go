package service

import "main/domain/game"

type GameStartedPayload struct {
	InProgress bool `json:"inProgress"` // Whether the game is in progress
}

type NewGamePayload struct {
	PlayerOrder []string           `json:"playerOrder"` // Order of players at the table
	Settings    *game.GameSettings `json:"settings"`    // Game settings
}

type GameStatePayload struct {
	InProgress  bool               `json:"inProgress"`  // Whether the game is in progress
	PlayerOrder []string           `json:"playerOrder"` // Order of players at the table
	Settings    *game.GameSettings `json:"settings"`    // Game settings
}

type TableStatePayload struct {
	TableID   string            `json:"tableId"`
	HostID    string            `json:"hostId"`
	GameState *GameStatePayload `json:"gameState"`
}
