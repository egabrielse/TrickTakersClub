package settings

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
