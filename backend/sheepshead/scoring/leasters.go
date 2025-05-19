package scoring

import (
	"sheepshead/utils"
)

func ScoreLeastersHand(
	points map[string]int,
	tricks map[string]int,
) (
	scores map[string]int, // Map from player ID to score
	leasterIDs []string, // List of player IDs who won the hand
) {
	playerIDs := utils.MapKeys(points)
	leasterIDs = []string{}
	leasterPoints := 0
	// Find the player(s) with the least points (who have taken a trick)
	for _, playerID := range playerIDs {
		tricksWon := tricks[playerID]
		pointsWon := points[playerID]
		if tricksWon == 0 {
			continue
		} else if len(leasterIDs) == 0 || pointsWon == leasterPoints {
			leasterIDs = append(leasterIDs, playerID)
			leasterPoints = pointsWon
		} else if pointsWon < leasterPoints {
			// Lower points is found, reset leasters
			leasterIDs = []string{playerID}
			leasterPoints = pointsWon
		}
	}
	// There can only be one leaster.
	// If there is a tie, no one wins (draw)
	leasterID := leasterIDs[0]
	if len(leasterIDs) > 1 {
		leasterIDs = []string{}
		leasterID = ""
	}
	// Calculate scores
	scores = make(map[string]int)
	for _, playerID := range playerIDs {
		if leasterID == "" {
			scores[playerID] = 0 // Draw
		} else if playerID == leasterID {
			scores[playerID] = 4 // Leaster
		} else {
			scores[playerID] = -1 // Others
		}
	}
	return scores, leasterIDs
}
