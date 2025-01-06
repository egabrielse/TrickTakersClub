package game

var CallingMethod = struct {
	Alone          string
	JackOfDiamonds string
	CallAnAce      string
}{
	Alone:          "alone",
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
	AutoDeal         bool
	PlayerCount      int
	CallingMethod    string
	NoPickResolution string
	DoubleOnTheBump  bool
	Blitzing         bool
	Cracking         bool
}{
	AutoDeal:         true,
	PlayerCount:      5,
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
	Pick  string
	Call  string
	Bury  string
	Play  string
	Score string
}{
	Pick:  "pick",
	Call:  "call",
	Bury:  "bury",
	Play:  "play",
	Score: "score",
}

const DeckSize = 32
