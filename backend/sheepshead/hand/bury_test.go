package hand

import (
	"sheepshead/deck"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBury(t *testing.T) {
	t.Run("New Blind", func(t *testing.T) {
		bury := NewBury()

		assert.Equal(t, len(bury.Cards), 0)
	})

	t.Run("Bury Cards", func(t *testing.T) {
		bury := NewBury()
		cards := []*deck.Card{
			deck.NewCard(deck.CardSuit.Club, deck.CardRank.Ace),
			deck.NewCard(deck.CardSuit.Diamond, deck.CardRank.Eight),
		}

		bury.BuryCards(cards)
		assert.Equal(t, bury.Cards, cards)
		assert.True(t, bury.IsComplete())
	})

}
