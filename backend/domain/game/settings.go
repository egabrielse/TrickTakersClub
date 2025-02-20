package game

import (
	"fmt"
	"main/domain/game/deck"
	"main/utils"
)

type GameSettings struct {
	AutoDeal         bool   `json:"autoDeal"`
	PlayerCount      int    `json:"playerCount"`
	CallingMethod    string `json:"callingMethod"`
	NoPickResolution string `json:"noPickResolution"`
	DoubleOnTheBump  bool   `json:"doubleOnTheBump"`
	HandSize         int    `json:"handSize"`
}

func NewGameSettings() *GameSettings {
	return &GameSettings{
		AutoDeal:         GameDefaults.AutoDeal,
		PlayerCount:      GameDefaults.PlayerCount,
		CallingMethod:    GameDefaults.CallingMethod,
		NoPickResolution: GameDefaults.NoPickResolution,
		DoubleOnTheBump:  GameDefaults.DoubleOnTheBump,
		HandSize:         GameDefaults.HandSize,
	}
}

func (gs *GameSettings) SetAutoDeal(autoDeal bool) {
	gs.AutoDeal = autoDeal
}

func (gs *GameSettings) SetPlayerCount(playerCount int) error {
	if playerCount < 3 || playerCount > 5 {
		return fmt.Errorf("invalid player count")
	}
	// Update the player count
	gs.PlayerCount = playerCount
	// Update other settings based on the player count
	switch playerCount {
	case 3:
		gs.CallingMethod = CallingMethod.CutThroat
		gs.HandSize = 10
	case 4:
		gs.CallingMethod = CallingMethod.CutThroat
		gs.HandSize = 7
	case 5:
		gs.HandSize = 6
	}
	return nil
}

func (gs *GameSettings) SetCallingMethod(callingMethod string) error {
	validMethods := []string{CallingMethod.CutThroat, CallingMethod.JackOfDiamonds, CallingMethod.CallAnAce}
	if !utils.Contains(validMethods, callingMethod) {
		return fmt.Errorf("invalid calling method")
	} else if gs.PlayerCount == 3 && callingMethod != CallingMethod.CutThroat {
		return fmt.Errorf("calling method must be alone")
	} else if gs.PlayerCount == 4 && callingMethod != CallingMethod.CutThroat {
		return fmt.Errorf("calling method must be alone")
	}
	gs.CallingMethod = callingMethod
	return nil
}

func (gs *GameSettings) SetNoPickResolution(noPickResolution string) error {
	validResolutions := []string{NoPickResolution.ScrewTheDealer, NoPickResolution.Leasters, NoPickResolution.Mosters}
	if !utils.Contains(validResolutions, noPickResolution) {
		return fmt.Errorf("invalid no pick resolution")
	}
	gs.NoPickResolution = noPickResolution
	return nil
}

func (gs *GameSettings) SetDoubleOnTheBump(doubleOnTheBump bool) {
	gs.DoubleOnTheBump = doubleOnTheBump
}

func (gs *GameSettings) GetBlindSize() int {
	return deck.DeckSize - gs.HandSize*gs.PlayerCount
}
