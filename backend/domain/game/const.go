package game

var CallingMethod = struct {
	JackOfDiamonds string
	CallAnAce      string
}{
	JackOfDiamonds: "jack-of-diamonds",
	CallAnAce:      "call-an-ace",
}

var NoPickResolution = struct {
	ScrewTheDealer string
	Leasters       string
	Mosters        string
	Doublers       string
}{
	ScrewTheDealer: "screw-the-dealer",
	Leasters:       "leasters",
	Mosters:        "mosters",
	Doublers:       "doublers",
}

var GameDefaults = struct {
	PlayerCount      int
	MinPlayers       int
	MaxPlayers       int
	CallingMethod    string
	NoPickResolution string
	DoubleOnTheBump  bool
	Blitzing         bool
}{
	PlayerCount:      5,
	MinPlayers:       3,
	MaxPlayers:       7,
	CallingMethod:    CallingMethod.JackOfDiamonds,
	NoPickResolution: NoPickResolution.ScrewTheDealer,
	DoubleOnTheBump:  false,
	Blitzing:         false,
}
