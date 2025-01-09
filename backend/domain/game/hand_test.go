package game

import (
	"main/domain/game/test"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestThreeHandedGame(t *testing.T) {
	settings := NewGameSettings(3)
	players := []string{test.Player1, test.Player2, test.Player3}
	hand := NewHand(players, test.MockNewDeck(), settings, 0)

	t.Run("NewHand", func(t *testing.T) {
		// No tricks have been played yet
		assert.Nil(t, hand.GetCurrentTrick())
		assert.Equal(t, 0, hand.CountPlayedTricks())
		// Player left of the dealer is the first to pick
		assert.Equal(t, test.Player2, hand.WhoIsNext())
		// Hand starts in the pick phase
		assert.Equal(t, HandPhase.Pick, hand.Phase)
	})

	t.Run("PickPhase", func(t *testing.T) {
		t.Run("Player attempts to pick out of turn", func(t *testing.T) {
			// Player 1 tries to pick out of turn
			err := hand.PickOrPass(test.Player1, true)
			assert.NotNil(t, err)
		})

		t.Run("Player 2 passes", func(t *testing.T) {
			// Player 2 passes on the blind
			hand.PickOrPass(test.Player2, false)
			// Still in the picking phase
			assert.Equal(t, HandPhase.Pick, hand.Phase)
			// Player 3's turn to pick or pass
			assert.Equal(t, test.Player3, hand.WhoIsNext())
		})

		t.Run("Player 3 picks", func(t *testing.T) {
			// Player 3 should have 10 cards in their hand
			assert.Equal(t, 10, len(hand.Players[test.Player3].Hand))
			// Player 3 picks up the blind
			hand.PickOrPass(test.Player3, true)
			// Should now be in the bury phase
			assert.Equal(t, HandPhase.Bury, hand.Phase)
			// Player 3 should now have two more cards
			assert.Equal(t, 12, len(hand.Players[test.Player3].Hand))
		})
	})

	t.Run("BuryPhase", func(t *testing.T) {
		t.Run("Non-picker attempts to bury", func(t *testing.T) {
			// Player 2 tries to bury
			err := hand.Bury(test.Player2, hand.Players[test.Player2].Hand[:2])
			assert.NotNil(t, err)
		})
		t.Run("Player 3 buries", func(t *testing.T) {
			// Player 3 buries two cards
			hand.Bury(test.Player3, hand.Players[test.Player3].Hand[:2])
			// Should now be in the play phase (picker goes alone in 3 handed game)
			assert.Equal(t, HandPhase.Play, hand.Phase)
			// Player 3 should now have 10 cards
			assert.Equal(t, 10, len(hand.Players[test.Player3].Hand))
			// Should now be the play phase (picker goes alone in 3 handed game)
		})
	})

	t.Run("PlayPhase", func(t *testing.T) {
		t.Run("Player attempts to play out of turn", func(t *testing.T) {
			// Player 1 tries to play out of turn
			err := hand.Play(test.Player1, hand.Players[test.Player1].Hand[0])
			assert.NotNil(t, err)
		})

		t.Run("Player 2 plays", func(t *testing.T) {
			// Player 2 plays a card
			err := hand.Play(test.Player2, hand.Players[test.Player2].Hand[0])
			assert.Nil(t, err)
			// Should now be player 3's turn
			assert.Equal(t, test.Player3, hand.WhoIsNext())
		})

		t.Run("Player 3 plays", func(t *testing.T) {
			// Player 3 plays a card
			err := hand.Play(test.Player3, hand.Players[test.Player3].Hand[0])
			assert.Nil(t, err)
			// Should now be player 1's turn
			assert.Equal(t, test.Player1, hand.WhoIsNext())
		})

		t.Run("Player 1 plays", func(t *testing.T) {
			// Player 1 plays a card
			err := hand.Play(test.Player1, hand.Players[test.Player1].Hand[0])
			assert.Nil(t, err)
			// The trick should be complete
			assert.Equal(t, 1, hand.CountPlayedTricks())
		})

		t.Run("Play rest of hand", func(t *testing.T) {
			// Play the rest of the hand
			for !hand.IsComplete() {
				playerID := hand.WhoIsNext()
				err := hand.Play(playerID, hand.Players[playerID].Hand[0])
				assert.Nil(t, err)
			}
			// The hand should be complete
			assert.True(t, hand.IsComplete())
			// The hand should have 10 tricks in a 3 handed game
			assert.Equal(t, 10, hand.CountPlayedTricks())
		})

		t.Run("Summary is accurate", func(t *testing.T) {
			summary := hand.SummarizeHand()
			// Opponent should have won
			assert.Equal(t, []string{test.Player1, test.Player2}, summary.Winners)
			winningPoints := summary.PointsWon[test.Player1] + summary.PointsWon[test.Player2]
			lostingPoints := summary.PointsWon[test.Player3]
			// Opponents points should be greater than picker's points
			assert.Greater(t, winningPoints, lostingPoints)
			// Player 3 should be the picker
			assert.Equal(t, test.Player3, summary.PickerID)
			// Score adjustments should be accurate
			assert.Equal(t, 1, summary.Scores[test.Player1])
			assert.Equal(t, 1, summary.Scores[test.Player2])
			assert.Equal(t, -2, summary.Scores[test.Player3])
		})
	})
}
