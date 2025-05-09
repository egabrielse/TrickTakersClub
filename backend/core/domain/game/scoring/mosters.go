package scoring

import "main/utils"

// ScoreMostersHand scores a hand of Mosters
// In mosters, the player(s) with the most points is the loser and pays the other players
func ScoreMostersHand(points map[string]int) (
	scores map[string]int, // Map from player ID to score
	mosterIDs []string, // List of player IDs who won the hand
) {
	playerIDs := utils.MapKeys(points)
	mosterIDs = []string{}
	mosterPoints := 0
	// Find the player(s) with the most points
	for _, playerID := range playerIDs {
		pointsWon := points[playerID]
		if len(mosterIDs) == 0 || pointsWon == mosterPoints {
			mosterIDs = append(mosterIDs, playerID)
			mosterPoints = pointsWon
		} else if pointsWon > mosterPoints {
			// Larger points is found, reset mosters
			mosterIDs = []string{playerID}
			mosterPoints = pointsWon
		}
	}
	// There can only be one moster.
	// If there is a tie, no one loses (draw)
	mosterID := mosterIDs[0]
	if len(mosterIDs) > 1 {
		mosterIDs = []string{}
		mosterID = ""
	}
	// Calculate scores
	scores = make(map[string]int)
	for _, playerID := range playerIDs {
		if mosterID == "" {
			scores[playerID] = 0 // Draw
		} else if playerID == mosterID {
			scores[playerID] = -4 // Moster
		} else {
			scores[playerID] = 1 // Others
		}
	}
	return scores, mosterIDs
}
