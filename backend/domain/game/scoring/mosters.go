package scoring

import "main/utils"

// ScoreMostersHand scores a hand of Mosters
// In mosters, the player(s) with the most points is the loser and pays the other players
func ScoreMostersHand(points map[string]int) (
	scores map[string]int, // Map from player ID to score
	winnerIDs []string, // List of player IDs who won the hand
) {
	playerIDs := utils.MapKeys(points)
	winnerIDs = []string{}
	loserIDs := []string{}
	losingPoints := 0

	for _, playerID := range playerIDs {
		pointsWon := points[playerID]
		if len(loserIDs) == 0 {
			// Set the first winner
			loserIDs = []string{playerID}
			losingPoints = pointsWon
		} else if pointsWon > losingPoints {
			// Reset when a lower score is found
			loserIDs = []string{playerID}
			losingPoints = pointsWon
		} else if pointsWon == losingPoints {
			// Tie for lowest score
			loserIDs = append(loserIDs, playerID)
		} else {
			continue
		}
	}

	loserCount := len(loserIDs)
	winnerCount := len(playerIDs) - loserCount
	scores = make(map[string]int)

	for _, playerID := range playerIDs {
		if utils.Contains(loserIDs, playerID) {
			// Winners get a chip from each loser
			scores[playerID] = -winnerCount
		} else {
			// Losers give a chip to each winner
			scores[playerID] = loserCount
			winnerIDs = append(winnerIDs, playerID)
		}
	}

	return scores, utils.AlphabetizeList(winnerIDs)
}
