package scoring

type ScoreboardRow struct {
	PlayerID    string `json:"playerId"`    // Player's ID
	Score       int    `json:"score"`       // Player's score
	TotalPoints int    `json:"totalPoints"` // Total number of points taken by the player
	TotalTricks int    `json:"totalTricks"` // Total number of tricks taken by the player
}

type Scoreboard []ScoreboardRow

func NewScoreboard(playerIDs []string) Scoreboard {
	scoreboard := Scoreboard{}
	for _, playerID := range playerIDs {
		scoreboard = append(scoreboard, ScoreboardRow{
			PlayerID:    playerID,
			Score:       0,
			TotalPoints: 0,
			TotalTricks: 0,
		})
	}
	return scoreboard
}

func (s *Scoreboard) UpdateScore(playerID string, score int, points int, tricks int) {
	for i, row := range *s {
		if row.PlayerID == playerID {
			(*s)[i].Score += score
			(*s)[i].TotalPoints += points
			(*s)[i].TotalTricks += tricks
			return
		}
	}
}
