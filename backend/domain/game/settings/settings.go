package settings

import (
	"fmt"
	"main/utils"
)

type GameSettings struct {
	CallMethod      string `json:"callingMethod"`
	NoPickMethod    string `json:"noPickResolution"`
	DoubleOnTheBump bool   `json:"doubleOnTheBump"`
	Blitzing        bool   `json:"blitzing"` // TODO: Implement
	Cracking        bool   `json:"cracking"` // TODO: Implement
}

func NewGameSettings() *GameSettings {
	return &GameSettings{
		CallMethod:      DefaultGameSettings.CallMethod,
		NoPickMethod:    DefaultGameSettings.NoPickMethod,
		DoubleOnTheBump: DefaultGameSettings.DoubleOnTheBump,
		Blitzing:        DefaultGameSettings.Blitzing,
		Cracking:        DefaultGameSettings.Cracking,
	}
}

func (gs *GameSettings) SetCallingMethod(callingMethod string) error {
	validMethods := []string{CallMethod.CutThroat, CallMethod.JackOfDiamonds, CallMethod.CallAnAce}
	if !utils.Contains(validMethods, callingMethod) {
		return fmt.Errorf("invalid calling method")
	}
	gs.CallMethod = callingMethod
	return nil
}

func (gs *GameSettings) SetNoPickResolution(noPickResolution string) error {
	validResolutions := []string{NoPickMethod.ScrewTheDealer, NoPickMethod.Leasters, NoPickMethod.Mosters}
	if !utils.Contains(validResolutions, noPickResolution) {
		return fmt.Errorf("invalid no pick resolution")
	}
	gs.NoPickMethod = noPickResolution
	return nil
}

func (gs *GameSettings) SetDoubleOnTheBump(doubleOnTheBump bool) {
	gs.DoubleOnTheBump = doubleOnTheBump
}
