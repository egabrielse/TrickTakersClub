package game

var CallingMethod = struct {
	CutThroat      string
	JackOfDiamonds string
	CallAnAce      string
}{
	CutThroat:      "cut-throat", // picker plays alone
	JackOfDiamonds: "jack-of-diamonds",
	CallAnAce:      "call-an-ace",
}

var NoPickResolution = struct {
	ScrewTheDealer string
	Leasters       string
	Mosters        string
}{
	ScrewTheDealer: "screw-the-dealer",
	Leasters:       "leasters",
	Mosters:        "mosters",
}

var GameDefaults = struct {
	AutoDeal         bool
	PlayerCount      int
	CallingMethod    string
	NoPickResolution string
	DoubleOnTheBump  bool
	HandSize         int
}{
	AutoDeal:         true,
	PlayerCount:      5,
	CallingMethod:    CallingMethod.JackOfDiamonds,
	NoPickResolution: NoPickResolution.ScrewTheDealer,
	DoubleOnTheBump:  false,
	HandSize:         6,
}

var PlayerRole = struct {
	Picker   string
	Partner  string
	Opponent string
}{
	Picker:   "picker",
	Partner:  "partner",
	Opponent: "opponent",
}

var HandPhase = struct {
	Setup string
	Pick  string
	Bury  string
	Call  string
	Play  string
	Score string
}{
	Setup: "setup",
	Pick:  "pick",
	Bury:  "bury",
	Call:  "call",
	Play:  "play",
	Score: "score",
}

var ScoringMethod = struct {
	Default  string
	Leasters string
	Mosters  string
}{
	Default:  "default",
	Leasters: "leasters",
	Mosters:  "mosters",
}
