package scoring

import (
	"sheepshead/utils"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestScoreMostersHand(t *testing.T) {
	t.Run("Base Test", func(t *testing.T) {
		points := map[string]int{
			"1": 10,
			"2": 10,
			"3": 70,
			"4": 10,
			"5": 10,
		}
		scores, winnerIDs := ScoreMostersHand(points)
		expected := map[string]int{
			"1": 1,
			"2": 1,
			"3": -4,
			"4": 1,
			"5": 1,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"3"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Draw", func(t *testing.T) {
		points := map[string]int{
			"1": 10,
			"2": 10,
			"3": 30,
			"4": 30,
			"5": 20,
		}
		scores, winnerIDs := ScoreMostersHand(points)
		expected := map[string]int{
			"1": 0,
			"2": 0,
			"3": 0,
			"4": 0,
			"5": 0,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})
}
