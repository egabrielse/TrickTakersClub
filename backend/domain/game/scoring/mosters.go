package scoring

import "main/utils"

// ScoreMostersHand scores a hand of Mosters
// In mosters, the player(s) with the most points is the loser and pays the other players
func ScoreMostersHand(points map[string]int) (
	scores map[string]int, // Map from player ID to score
	mosterIDs []string, // List of player IDs who won the hand
) {
	playerIDs := utils.MapKeys(points)
	mosterID := ""
	mosterPoints := 0

	for _, playerID := range playerIDs {
		pointsWon := points[playerID]
		if mosterID == "" && pointsWon > mosterPoints {
			// Set the first winner
			mosterID = playerID
			mosterPoints = pointsWon
		} else if pointsWon == mosterPoints {
			// Tie for lowest score
			mosterID = ""
			mosterPoints = 0
			break
		}
	}
	mosterIDs = []string{}
	if mosterID != "" {
		mosterIDs = append(mosterIDs, mosterID)
	}
	scores = make(map[string]int)
	for _, playerID := range playerIDs {
		if playerID == mosterID {
			scores[playerID] = -4
		} else {
			scores[playerID] = 1
		}
	}
	return scores, mosterIDs
}
