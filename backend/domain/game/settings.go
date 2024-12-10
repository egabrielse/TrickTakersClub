package game

type GameSettings struct {
	AutoDeal         bool   `json:"autoDeal"`
	PlayerCount      int    `json:"playerCount"`
	CallingMethod    string `json:"callingMethod"`
	NoPickResolution string `json:"noPickResolution"`
	DoubleOnTheBump  bool   `json:"doubleOnTheBump"`
	Blitzing         bool   `json:"blitzing"`
	Cracking         bool   `json:"cracking"`
}

func NewGameSettings() *GameSettings {
	return &GameSettings{
		AutoDeal:         GameDefaults.AutoDeal,
		PlayerCount:      GameDefaults.PlayerCount,
		CallingMethod:    GameDefaults.CallingMethod,
		NoPickResolution: GameDefaults.NoPickResolution,
		DoubleOnTheBump:  GameDefaults.DoubleOnTheBump,
		Blitzing:         GameDefaults.Blitzing,
		Cracking:         GameDefaults.Cracking,
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
	case 7:
		return 4, 4
	default:
		return 0, 0
	}
}
