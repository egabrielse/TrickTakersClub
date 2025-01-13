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
	Pick string
	Bury string
	Call string
	Play string
	Done string
}{
	Pick: "pick",
	Bury: "bury",
	Call: "call",
	Play: "play",
	Done: "done",
}

const DeckSize = 32

var ScoringMethod = struct {
	Default  string
	Leasters string
	Mosters  string
}{
	Default:  "default",
	Leasters: "leasters",
	Mosters:  "mosters",
}
