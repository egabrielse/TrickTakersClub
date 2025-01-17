package hand

import (
	"main/domain/game/test"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPlay(t *testing.T) {
	trickCount := 6
	players := test.CreateListOfPlayers(5)
	play := NewPlay(players, trickCount)
	deck := test.MockNewDeck()
	// Draw two cards for the blind
	deck.Draw(2)

	t.Run("New Play", func(t *testing.T) {
		assert.Equal(t, test.Player1, play.WhoIsNext())
		assert.Equal(t, 0, play.CountPlayedTricks())
		assert.False(t, play.IsComplete())
		summary := play.SummarizeTricks()
		assert.Len(t, summary, 0)
	})

	t.Run("Play One Card", func(t *testing.T) {
		card := deck.Draw(1)[0]
		summary := play.PlayCard(card)
		assert.Nil(t, summary)
		assert.Equal(t, 0, play.CountPlayedTricks())
		assert.False(t, play.IsComplete())
		// Next player should be up
		assert.Equal(t, test.Player2, play.WhoIsNext())
	})

	t.Run("Play Out the Trick", func(t *testing.T) {
		cards := deck.Draw(4)
		for index := range cards {
			card := cards[index]
			summary := play.PlayCard(card)
			if index < 3 {
				assert.Nil(t, summary)
			} else {
				// Once the last card is played, the trick should be summarized and returned by PlayCard
				assert.NotNil(t, summary)
				// The player who took the trick starts off the next trick
				assert.Equal(t, summary.TakerID, play.WhoIsNext())
			}
		}
		assert.Equal(t, 1, play.CountPlayedTricks())
		assert.False(t, play.IsComplete())
	})

	t.Run("Play Out the Hand", func(t *testing.T) {
		for play.IsComplete() == false {
			card := deck.Draw(1)[0]
			play.PlayCard(card)
		}
		assert.Equal(t, trickCount, play.CountPlayedTricks())
		assert.Equal(t, "", play.WhoIsNext())
		summaries := play.SummarizeTricks()
		assert.Len(t, summaries, trickCount)
	})
}
