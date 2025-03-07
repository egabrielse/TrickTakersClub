package scoring

import (
	"main/utils"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestScoreHand(t *testing.T) {
	t.Run("Picker wins all tricks", func(t *testing.T) {
		points := map[string]int{
			"1": 120,
			"2": 0,
			"3": 0,
			"4": 0,
			"5": 0,
		}
		tricks := map[string]int{
			"1": 6,
			"2": 0,
			"3": 0,
			"4": 0,
			"5": 0,
		}
		scores, winnerIDs, _ := ScoreHand("1", "", points, tricks, false)
		expected := map[string]int{
			"1": 12,
			"2": -3,
			"3": -3,
			"4": -3,
			"5": -3,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"1"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Picker wins with a partner", func(t *testing.T) {
		points := map[string]int{
			"1": 60,
			"2": 20,
			"3": 20,
			"4": 20,
			"5": 20,
		}
		tricks := map[string]int{
			"1": 2,
			"2": 1,
			"3": 1,
			"4": 1,
			"5": 1,
		}
		scores, winnerIDs, _ := ScoreHand("1", "2", points, tricks, false)
		expected := map[string]int{
			"1": 2,
			"2": 1,
			"3": -1,
			"4": -1,
			"5": -1,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"1", "2"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Picker loses with Double on the Bump", func(t *testing.T) {
		points := map[string]int{
			"1": 20,
			"2": 5,
			"3": 35,
			"4": 40,
			"5": 20,
		}
		tricks := map[string]int{
			"1": 1,
			"2": 1,
			"3": 1,
			"4": 2,
			"5": 1,
		}
		scores, winnerIDs, _ := ScoreHand("1", "5", points, tricks, true)
		expected := map[string]int{
			"1": -4,
			"2": 2,
			"3": 2,
			"4": 2,
			"5": -2,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"2", "3", "4"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})

	t.Run("Catastrophic loss for picker", func(t *testing.T) {
		points := map[string]int{
			"1": 0,
			"2": 40,
			"3": 20,
			"4": 40,
			"5": 20,
		}
		tricks := map[string]int{
			"1": 0,
			"2": 2,
			"3": 1,
			"4": 2,
			"5": 1,
		}
		scores, winnerIDs, _ := ScoreHand("1", "", points, tricks, true)
		expected := map[string]int{
			"1": -24,
			"2": 6,
			"3": 6,
			"4": 6,
			"5": 6,
		}
		assert.Equal(t, expected, scores)
		assert.Equal(t, []string{"2", "3", "4", "5"}, winnerIDs)
		utils.AssertZeroSum(t, utils.MapValues(expected), utils.MapValues(scores))
	})
}
