package scoring

import (
	"main/utils"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestScoreMostersHand(t *testing.T) {
	t.Run("Three players, one loser", func(t *testing.T) {
		points := map[string]int{
			"1": 30,
			"2": 30,
			"3": 60,
		}
		scores := ScoreMostersHand(points)
		expected := map[string]int{
			"1": 1,
			"2": 1,
			"3": -2,
		}
		assert.Equal(t, expected, scores)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Four players, one loser", func(t *testing.T) {
		points := map[string]int{
			"1": 20,
			"2": 20,
			"3": 60,
			"4": 20,
		}
		scores := ScoreMostersHand(points)
		expected := map[string]int{
			"1": 1,
			"2": 1,
			"3": -3,
			"4": 1,
		}
		assert.Equal(t, expected, scores)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Five players, one winner", func(t *testing.T) {
		points := map[string]int{
			"1": 10,
			"2": 10,
			"3": 70,
			"4": 10,
			"5": 10,
		}
		scores := ScoreMostersHand(points)
		expected := map[string]int{
			"1": 1,
			"2": 1,
			"3": -4,
			"4": 1,
			"5": 1,
		}
		assert.Equal(t, expected, scores)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Four players, two winners", func(t *testing.T) {
		points := map[string]int{
			"1": 20,
			"2": 20,
			"3": 40,
			"4": 40,
		}
		scores := ScoreMostersHand(points)
		expected := map[string]int{
			"1": 2,
			"2": 2,
			"3": -2,
			"4": -2,
		}
		assert.Equal(t, expected, scores)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Five players, two winners", func(t *testing.T) {
		points := map[string]int{
			"1": 10,
			"2": 10,
			"3": 45,
			"4": 45,
			"5": 10,
		}
		scores := ScoreMostersHand(points)
		expected := map[string]int{
			"1": 2,
			"2": 2,
			"3": -3,
			"4": -3,
			"5": 2,
		}
		assert.Equal(t, expected, scores)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})
}
