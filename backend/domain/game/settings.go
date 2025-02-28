package game

import (
	"fmt"
	"main/utils"
)

type GameSettings struct {
	CallingMethod    string `json:"callingMethod"`
	NoPickResolution string `json:"noPickResolution"`
	DoubleOnTheBump  bool   `json:"doubleOnTheBump"` // TODO: Implement
	Blitzing         bool   `json:"blitzing"`        // TODO: Implement
	Cracking         bool   `json:"cracking"`        // TODO: Implement
}

func NewGameSettings() *GameSettings {
	return &GameSettings{
		CallingMethod:    GameDefaults.CallingMethod,
		NoPickResolution: GameDefaults.NoPickResolution,
		DoubleOnTheBump:  GameDefaults.DoubleOnTheBump,
		Blitzing:         GameDefaults.Blitzing,
		Cracking:         GameDefaults.Cracking,
	}
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
