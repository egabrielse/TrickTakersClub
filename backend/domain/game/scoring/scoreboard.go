package scoring

import "main/utils"

type ScoreboardRow struct {
	Score    int `json:"score"`    // Player's score
	HandsWon int `json:"handsWon"` // Number of hands won
}

type Scoreboard map[string]*ScoreboardRow

func NewScoreboard(playerIDs []string) Scoreboard {
	scoreboard := Scoreboard{}
	for _, playerID := range playerIDs {
		scoreboard[playerID] = &ScoreboardRow{
			Score: 0,
		}
	}
	return scoreboard
}

func (s *Scoreboard) TallyHand(payouts map[string]int, winners []string) {
	for playerID, payout := range payouts {
		(*s)[playerID].Score += payout
		if utils.Contains(winners, playerID) {
			(*s)[playerID].HandsWon++
		}
	}
}
