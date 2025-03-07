package scoring

type ScoreboardRow struct {
	Score    int `json:"score"`    // Player's score
	HandsWon int `json:"handsWon"` // Number of hands won
}

type Scoreboard struct {
	Rows        map[string]*ScoreboardRow `json:"rows"`
	HandsPlayed int                       `json:"handsPlayed"`
}

func NewScoreboard(playerIDs []string) Scoreboard {
	scoreboard := Scoreboard{
		Rows:        map[string]*ScoreboardRow{},
		HandsPlayed: 0,
	}
	for _, playerID := range playerIDs {
		scoreboard.Rows[playerID] = &ScoreboardRow{
			Score:    0,
			HandsWon: 0,
		}
	}
	return scoreboard
}

func (s *Scoreboard) TallyHand(payouts map[string]int, winners []string) {
	s.HandsPlayed++
	for playerID, payout := range payouts {
		s.Rows[playerID].Score += payout
	}
	for _, winner := range winners {
		s.Rows[winner].HandsWon++
	}
}
