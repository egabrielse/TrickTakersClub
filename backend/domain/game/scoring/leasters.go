package scoring

import (
	"main/utils"
)

func ScoreLeastersHand(
	points map[string]int,
	tricks map[string]int,
) (
	scores map[string]int, // Map from player ID to score
	leasterIDs []string, // List of player IDs who won the hand
) {
	playerIDs := utils.MapKeys(points)
	leasterID := ""
	leasterPoints := 0

	for _, playerID := range playerIDs {
		tricksWon := tricks[playerID]
		pointsWon := points[playerID]
		if tricksWon == 0 {
			continue
		} else if leasterID == "" || pointsWon < leasterPoints {
			leasterID = playerID
			leasterPoints = pointsWon
		} else if pointsWon == leasterPoints {
			// If there is a tie, no one wins (draw)
			leasterID = ""
			leasterPoints = 0
			break
		}
	}
	leasterIDs = []string{}
	if leasterID != "" {
		leasterIDs = append(leasterIDs, leasterID)
	}
	scores = make(map[string]int)
	for _, playerID := range playerIDs {
		if leasterID == "" {
			scores[playerID] = 0
		} else if playerID == leasterID {
			scores[playerID] = 4
		} else {
			scores[playerID] = -1
		}
	}
	return scores, leasterIDs
}
