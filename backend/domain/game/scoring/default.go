package scoring

import (
	"main/utils"
	"math"
)

// DefaultScoringFunc is the default scoring function for a hand of Sheepshead
func ScoreHand(
	pickerID string,
	partnerID string,
	points map[string]int,
	tricks map[string]int,
	doubleOnBump bool,
) (scores map[string]int) {
	// sum count of tricks to find total tricks
	totalTricks := 0
	for _, trick := range tricks {
		totalTricks += trick
	}
	playerIDs := utils.MapKeys(points)

	// Base score adjustments (defaults to opponents losing 1 point each)
	opponentBaseScore := -1
	pickerBaseScore := 0
	partnerBaseScore := 0

	// Multiplier to apply to base scores
	scoreMultiplier := 1

	// Determine the base scores for the picker and partner
	if partnerID == "" {
		// All points go to the picker
		pickerBaseScore = len(playerIDs) - 1
	} else {
		// Points are split between the picker and partner
		// Picker gets at least half the points
		pickerBaseScore = int(math.Ceil(float64(len(playerIDs)-2) / 2))
		partnerBaseScore = int(math.Floor(float64(len(playerIDs)-2) / 2))
	}

	pickingTeamPoints := points[pickerID] + points[partnerID]
	pickingTeamTricks := tricks[pickerID] + tricks[partnerID]

	// Apply default score multipliers
	if pickingTeamTricks == totalTricks || pickingTeamTricks == PointsNone {
		// Scores are tripled if either team took all tricks
		scoreMultiplier = scoreMultiplier * 3
	} else if pickingTeamPoints < PointsSchneider || pickingTeamPoints > (PointsAll-PointsSchneider) {
		// Scores are doubled if either team did not get Schneider
		scoreMultiplier = scoreMultiplier * 2
	}

	// Invert score multiplier if picking team lost
	if pickingTeamPoints < PointsHalf {
		scoreMultiplier = scoreMultiplier * -1
		if doubleOnBump {
			// Double on the bump doubles the loss for the picking team
			scoreMultiplier = scoreMultiplier * 2
		}
	}

	// Apply the score multipliers to the base scores
	scores = make(map[string]int)

	// Update the scores in the results
	for _, ID := range playerIDs {
		if ID == pickerID {
			scores[ID] = pickerBaseScore * scoreMultiplier
		} else if ID == partnerID {
			scores[ID] = partnerBaseScore * scoreMultiplier
		} else {
			scores[ID] = opponentBaseScore * scoreMultiplier
		}
	}
	return scores
}
