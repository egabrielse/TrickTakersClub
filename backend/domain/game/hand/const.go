package hand

const PlayerCount = 5
const HandSize = 6
const BlindSize = 2

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

var CallMethod = struct {
	CutThroat      string
	JackOfDiamonds string
	CallAnAce      string
}{
	CutThroat:      "cut-throat",
	JackOfDiamonds: "jack-of-diamonds",
	CallAnAce:      "call-an-ace",
}

var NoPickMethod = struct {
	ScrewTheDealer string
	Leasters       string
	Mosters        string
	Doublers       string
}{
	ScrewTheDealer: "screw-the-dealer",
	Leasters:       "leasters",
	Mosters:        "mosters",
	Doublers:       "doublers", // TODO: Implement
}

var DefaultGameSettings = struct {
	CallMethod      string
	NoPickMethod    string
	DoubleOnTheBump bool
	Blitzing        bool
	Cracking        bool
}{
	CallMethod:      CallMethod.JackOfDiamonds,
	NoPickMethod:    NoPickMethod.ScrewTheDealer,
	DoubleOnTheBump: false,
	Blitzing:        false, // TODO: Implement
	Cracking:        false, // TODO: Implement
}
