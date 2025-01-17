package game

type ScoreboardRow struct {
	Score       int `json:"score"`       // Player's score
	TotalPoints int `json:"totalPoints"` // Total number of points taken by the player
	TotalTricks int `json:"totalTricks"` // Total number of tricks taken by the player
}

type Scoreboard map[string]ScoreboardRow

func NewScoreboard(playerIDs []string) Scoreboard {
	scoreboard := Scoreboard{}
	for _, playerID := range playerIDs {
		scoreboard[playerID] = ScoreboardRow{
			Score:       0,
			TotalPoints: 0,
			TotalTricks: 0,
		}
	}
	return scoreboard
}

func (s *Scoreboard) UpdateScore(playerID string, score int, points int, tricks int) {
	row := (*s)[playerID]
	row.TotalPoints += points
	row.TotalTricks += tricks
	(*s)[playerID] = row
}
