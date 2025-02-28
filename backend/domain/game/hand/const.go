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
