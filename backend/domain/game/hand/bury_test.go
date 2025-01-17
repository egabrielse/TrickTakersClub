package hand

import (
	"main/domain/game/deck"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBury(t *testing.T) {
	t.Run("New Blind", func(t *testing.T) {
		bury := NewBury(2)

		assert.Equal(t, bury.BlindSize, 2)
		assert.Equal(t, len(bury.Cards), 0)
	})

	t.Run("Bury Cards", func(t *testing.T) {
		bury := NewBury(2)
		cards := []*deck.Card{
			deck.NewCard(deck.CardSuit.Club, deck.CardRank.Ace),
			deck.NewCard(deck.CardSuit.Diamond, deck.CardRank.Eight),
		}

		bury.BuryCards(cards)
		assert.Equal(t, bury.Cards, cards)
		assert.True(t, bury.IsComplete())
	})

}
