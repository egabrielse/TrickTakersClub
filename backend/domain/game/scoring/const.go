package scoring

// Key point values in a hand
const (
	PointsNone      = 0
	PointsSchneider = 30
	PointsHalf      = 60
	PointsAll       = 120
)

var PayoutMultiplier = struct {
	DoubleOnTheBump string
	Cracking        string
	Blitzing        string
	NoSchneider     string
	NoTricks        string
}{
	DoubleOnTheBump: "double-on-the-bump",
	Cracking:        "cracking",
	Blitzing:        "blitzing",
	NoSchneider:     "no-schneider",
	NoTricks:        "no-tricks",
}
