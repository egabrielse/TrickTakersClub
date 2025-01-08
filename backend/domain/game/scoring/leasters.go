package scoring

import (
	"main/utils"
)

func ScoreLeastersHand(
	points map[string]int,
	tricks map[string]int,
) (scores map[string]int) {
	playerIDs := utils.MapKeys(points)
	winnerIDs := []string{}
	winningPoints := 0

	for _, playerID := range playerIDs {
		tricksWon := tricks[playerID]
		pointsWon := points[playerID]
		if tricksWon == 0 {
			continue
		} else if len(winnerIDs) == 0 {
			// Set the first winner
			winnerIDs = []string{playerID}
			winningPoints = pointsWon
		} else if pointsWon < winningPoints {
			// Reset when a lower score is found
			winnerIDs = []string{playerID}
			winningPoints = pointsWon
		} else if pointsWon == winningPoints {
			// Tie for lowest score
			winnerIDs = append(winnerIDs, playerID)
		} else {
			continue
		}
	}

	winnerCount := len(winnerIDs)
	loserCount := len(playerIDs) - winnerCount
	scores = make(map[string]int)

	for _, playerID := range playerIDs {
		if utils.Contains(winnerIDs, playerID) {
			// Winners get a chip from each loser
			scores[playerID] = loserCount
		} else {
			// Losers give a chip to each winner
			scores[playerID] = -winnerCount
		}
	}

	return scores
}
