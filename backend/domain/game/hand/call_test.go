package hand

import (
	"main/domain/game/deck"
	"main/domain/game/test"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCall(t *testing.T) {
	card := deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ace)
	t.Run("New Call", func(t *testing.T) {
		call := NewCall()
		assert.False(t, call.IsComplete())
		assert.Empty(t, call.GetPartnerIfRevealed())
		assert.Nil(t, call.GetCalledCard())
		assert.Empty(t, call.GetPartnerID())
	})

	t.Run("Call a Partner", func(t *testing.T) {
		call := NewCall()
		call.CallPartner(card, test.Player1)
		assert.True(t, call.IsComplete())
		assert.Equal(t, test.Player1, call.GetPartnerID())
		assert.Equal(t, card, call.GetCalledCard())
	})

	t.Run("Go It Alone", func(t *testing.T) {
		call := NewCall()
		assert.False(t, call.IsComplete())
		call.GoAlone()
		assert.True(t, call.IsComplete())
		assert.Nil(t, call.GetCalledCard())
	})

	t.Run("Reveal", func(t *testing.T) {
		call := NewCall()
		call.CallPartner(card, test.Player1)
		call.Reveal()
		assert.Equal(t, test.Player1, call.GetPartnerIfRevealed())
	})
}
