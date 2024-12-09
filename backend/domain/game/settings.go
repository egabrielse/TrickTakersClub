package game

type GameSettings struct {
	PlayerCount      int    `json:"playerCount"`
	CallingMethod    string `json:"callingMethod"`
	NoPickResolution string `json:"noPickResolution"`
	DoubleOnTheBump  bool   `json:"doubleOnTheBump"`
	Blitzing         bool   `json:"blitzing"`
}

func NewGameSettings() *GameSettings {
	return &GameSettings{
		PlayerCount:      GameDefaults.PlayerCount,
		CallingMethod:    GameDefaults.CallingMethod,
		NoPickResolution: GameDefaults.NoPickResolution,
		DoubleOnTheBump:  GameDefaults.DoubleOnTheBump,
		Blitzing:         GameDefaults.Blitzing,
	}
}
