package scoring

import (
	"main/utils"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestScoreMostersHand(t *testing.T) {
	t.Run("One winner", func(t *testing.T) {
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
		assert.Equal(t, []string{"1", "2", "4", "5"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Two winners", func(t *testing.T) {
		points := map[string]int{
			"1": 10,
			"2": 10,
			"3": 45,
			"4": 45,
			"5": 10,
		}
		scores, winnerIDs := ScoreMostersHand(points)
		expected := map[string]int{
			"1": 2,
			"2": 2,
			"3": -3,
			"4": -3,
			"5": 2,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"1", "2", "5"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})
}
