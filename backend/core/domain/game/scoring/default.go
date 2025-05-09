package scoring

import (
	"main/utils"
	"math"
)

// DefaultScoringFunc is the default scoring function for a hand of Game
func ScoreHand(
	pickerID string,
	partnerID string,
	points map[string]int,
	tricks map[string]int,
	doubleOnBump bool,
) (
	payouts map[string]int, // Map from player ID to score
	winnerIDs []string, // List of player IDs who won the hand
	multipliers []string, // List of multipliers applied to the payouts
) {
	// sum count of tricks to find total tricks
	totalTricks := 0
	for _, trick := range tricks {
		totalTricks += trick
	}
	playerIDs := utils.MapKeys(points)
	pickingTeamPoints := points[pickerID] + points[partnerID]
	pickingTeamTricks := tricks[pickerID] + tricks[partnerID]

	// Picking team must take more than half the points to win
	pickeringTeamWon := pickingTeamPoints > PointsHalf

	// List the IDs of the winners
	winnerIDs = []string{}
	for _, ID := range playerIDs {
		if (ID == pickerID || ID == partnerID) && pickeringTeamWon {
			winnerIDs = append(winnerIDs, ID)
		} else if ID != pickerID && ID != partnerID && !pickeringTeamWon {
			winnerIDs = append(winnerIDs, ID)
		}
	}

	// Base score adjustments (defaults to opponents losing 1 point each)
	opponentPayout := -1
	pickerPayout := 0
	partnerPayout := 0

	// Multiplier to apply to base scores
	payoutMultiplier := 1
	multipliers = []string{}

	// Determine the base scores for the picker and partner
	if partnerID == "" {
		// All points go to the picker
		pickerPayout = len(playerIDs) - 1
	} else {
		// Points are split between the picker and partner
		// Picker gets at least half the points
		pickerPayout = int(math.Ceil(float64(len(playerIDs)-2) / 2))
		partnerPayout = int(math.Floor(float64(len(playerIDs)-2) / 2))
	}

	// Apply default score multipliers
	if pickingTeamTricks == totalTricks || pickingTeamTricks == PointsNone {
		// Scores are tripled if either team took all tricks
		payoutMultiplier = payoutMultiplier * 3
		multipliers = append(multipliers, PayoutMultiplier.NoTricks)
	} else if pickingTeamPoints <= PointsSchneider || pickingTeamPoints > (PointsAll-PointsSchneider) {
		// Scores are doubled if either team did not get Schneider
		// Picker + Partner must get at least 31, while opponents must get at least 30
		payoutMultiplier = payoutMultiplier * 2
		multipliers = append(multipliers, PayoutMultiplier.NoSchneider)
	}

	// Invert score multiplier if picking team lost (60 or less)
	if pickingTeamPoints <= PointsHalf {
		payoutMultiplier = payoutMultiplier * -1
		if doubleOnBump {
			// Double on the bump doubles the loss for the picking team
			payoutMultiplier = payoutMultiplier * 2
			multipliers = append(multipliers, PayoutMultiplier.DoubleOnTheBump)
		}
	}

	// Apply the score multipliers to the base scores
	payouts = make(map[string]int)

	// Update the payouts in the results
	for _, ID := range playerIDs {
		if ID == pickerID {
			payouts[ID] = pickerPayout * payoutMultiplier
		} else if ID == partnerID {
			payouts[ID] = partnerPayout * payoutMultiplier
		} else {
			payouts[ID] = opponentPayout * payoutMultiplier
		}
	}
	return payouts, utils.AlphabetizeList(winnerIDs), multipliers
}
