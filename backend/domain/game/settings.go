package game

import (
	"fmt"
	"main/utils"
)

type GameSettings struct {
	AutoDeal         bool   `json:"autoDeal"`
	CallingMethod    string `json:"callingMethod"`
	NoPickResolution string `json:"noPickResolution"`
	DoubleOnTheBump  bool   `json:"doubleOnTheBump"`
	HandSize         int    `json:"handSize"`
}

func NewGameSettings() *GameSettings {
	return &GameSettings{
		AutoDeal:         GameDefaults.AutoDeal,
		CallingMethod:    GameDefaults.CallingMethod,
		NoPickResolution: GameDefaults.NoPickResolution,
		DoubleOnTheBump:  GameDefaults.DoubleOnTheBump,
		HandSize:         GameDefaults.HandSize,
	}
}

func (gs *GameSettings) SetAutoDeal(autoDeal bool) {
	gs.AutoDeal = autoDeal
}

func (gs *GameSettings) SetCallingMethod(callingMethod string) error {
	validMethods := []string{CallingMethod.CutThroat, CallingMethod.JackOfDiamonds, CallingMethod.CallAnAce}
	if !utils.Contains(validMethods, callingMethod) {
		return fmt.Errorf("invalid calling method")
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
