package game

type GameSettings struct {
	AutoDeal         bool   `json:"autoDeal"`
	PlayerCount      int    `json:"playerCount"`
	CallingMethod    string `json:"callingMethod"`
	NoPickResolution string `json:"noPickResolution"`
	DoubleOnTheBump  bool   `json:"doubleOnTheBump"`
}

func NewGameSettings(playerCount int) *GameSettings {
	settings := &GameSettings{
		AutoDeal:         GameDefaults.AutoDeal,
		PlayerCount:      playerCount,
		CallingMethod:    GameDefaults.CallingMethod,
		NoPickResolution: GameDefaults.NoPickResolution,
		DoubleOnTheBump:  GameDefaults.DoubleOnTheBump,
	}
	if playerCount == 3 || playerCount == 4 {
		settings.CallingMethod = CallingMethod.Alone
		settings.NoPickResolution = NoPickResolution.ScrewTheDealer
		return settings
	} else if playerCount == 5 {
		settings.CallingMethod = CallingMethod.JackOfDiamonds
		settings.NoPickResolution = NoPickResolution.Leasters
		return settings
	} else if playerCount == 6 {
		settings.CallingMethod = CallingMethod.JackOfDiamonds
		settings.NoPickResolution = NoPickResolution.Leasters
		return settings
	} else {
		return nil // unsupported player count
	}
}

func (gs *GameSettings) DeriveHandBlindSize() (handSize int, blindSize int) {
	switch gs.PlayerCount {
	case 3:
		return 10, 2
	case 4:
		return 7, 4
	case 5:
		return 6, 2
	case 6:
		return 5, 2
	default:
		return 0, 0
	}
}
