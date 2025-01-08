package scoring

import (
	"main/utils"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestScoreLeastersHand(t *testing.T) {
	t.Run("Three players, one winner", func(t *testing.T) {
		points := map[string]int{
			"1": 45,
			"2": 30,
			"3": 45,
		}
		tricks := map[string]int{
			"1": 3,
			"2": 3,
			"3": 4,
		}
		scores, winnerIDs := ScoreLeastersHand(points, tricks)
		expected := map[string]int{
			"1": -1,
			"2": 2,
			"3": -1,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"2"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Five players, one winner", func(t *testing.T) {
		points := map[string]int{
			"1": 20,
			"2": 10,
			"3": 30,
			"4": 30,
			"5": 30,
		}
		tricks := map[string]int{
			"1": 2,
			"2": 2,
			"3": 2,
			"4": 2,
			"5": 2,
		}
		scores, winnerIDs := ScoreLeastersHand(points, tricks)
		expected := map[string]int{
			"1": -1,
			"2": 4,
			"3": -1,
			"4": -1,
			"5": -1,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"2"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Five players, two winners", func(t *testing.T) {
		points := map[string]int{
			"1": 30,
			"2": 10,
			"3": 30,
			"4": 40,
			"5": 10,
		}
		tricks := map[string]int{
			"1": 2,
			"2": 2,
			"3": 2,
			"4": 2,
			"5": 2,
		}
		scores, winnerIDs := ScoreLeastersHand(points, tricks)
		expected := map[string]int{
			"1": -2,
			"2": 3,
			"3": -2,
			"4": -2,
			"5": 3,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"2", "5"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Must take a trick to win", func(t *testing.T) {
		points := map[string]int{
			"1": 30,
			"2": 10,
			"3": 30,
			"4": 40,
			"5": 10,
		}
		tricks := map[string]int{
			"1": 3,
			"2": 0,
			"3": 3,
			"4": 2,
			"5": 2,
		}
		scores, winnerIDs := ScoreLeastersHand(points, tricks)
		expected := map[string]int{
			"1": -1,
			"2": -1,
			"3": -1,
			"4": -1,
			"5": 4,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"5"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})
}
