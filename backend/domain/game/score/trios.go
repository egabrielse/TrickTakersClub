package score

import "main/utils"

func ScoreTriosHand(pickerID string, _ string, totalTricks int, points map[string]int, tricks map[string]int) (scores map[string]int) {
	pickersPoints := points[pickerID]
	pickersTricks := tricks[pickerID]
	scores = make(map[string]int)

	pickerScore := 0
	opponentScore := 0
	switch {
	// All tricks and points
	case pickersTricks == totalTricks:
		// Picker won all trick (and therefore all points)
		pickerScore = 6
		opponentScore = -3

	case pickersPoints > PointsFischer:
		// Picker stopped opponents from getting Schneider
		pickerScore = 4
		opponentScore = -2

	case pickersPoints > PointsHalf:
		// Picker got more than half the points
		pickerScore = 2
		opponentScore = -1

	case pickersPoints > PointsSchneider:
		// Picker got Schneider
		pickerScore = -4
		opponentScore = 2

	case pickersPoints > PointsNone:
		// Picker got at least one point
		pickerScore = -8
		opponentScore = 4

	case pickersPoints == PointsNone:
		// Picker got no points
		pickerScore = -12
		opponentScore = 6
	}

	playerIDs := utils.MapKeys(points)
	// Update the scores in the results
	for _, ID := range playerIDs {
		if ID == pickerID {
			scores[ID] = pickerScore
		} else {
			scores[ID] = opponentScore
		}
	}
	return scores
}
