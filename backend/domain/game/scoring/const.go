package scoring

// Key point values in a hand
const (
	PointsNone      = 0
	PointsSchneider = 30
	PointsHalf      = 60
	PointsFischer   = 90
	PointsAll       = 120
)

// ScoringFunc is a function that calculates the scores for a hand of Game
type ScoringFunc func(
	pickerID string, // ID of the picker
	partnerID string, // ID of the picker's partner, empty if none
	totalTricks int, // Total number of tricks in the hand
	points map[string]int, // Map from player ID to number of points won
	tricks map[string]int, // Map from player ID to number of tricks won
) (
	scores map[string]int, // Map from player ID to score
)
