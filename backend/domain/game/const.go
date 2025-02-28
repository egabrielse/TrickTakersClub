package game

const PlayerCount = 5
const HandSize = 6
const BlindSize = 2

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
	CallingMethod    string
	NoPickResolution string
	DoubleOnTheBump  bool
	Blitzing         bool
	Cracking         bool
}{
	CallingMethod:    CallingMethod.JackOfDiamonds,
	NoPickResolution: NoPickResolution.ScrewTheDealer,
	DoubleOnTheBump:  false,
	Blitzing:         false,
	Cracking:         false,
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
