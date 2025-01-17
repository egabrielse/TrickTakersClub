package hand

import (
	"main/domain/game/deck"
	"main/domain/game/test"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBlind(t *testing.T) {
	pickOrder := test.CreateListOfPlayers(3)
	cardsInBlind := []*deck.Card{
		deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten),
		deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Ace),
	}

	t.Run("New Blind", func(t *testing.T) {
		blind := NewBlind(pickOrder, cardsInBlind)

		assert.Equal(t, 0, blind.Index)
		assert.Empty(t, blind.Cards)
		assert.Equal(t, len(pickOrder), len(blind.PickOrder))
		assert.Empty(t, blind.PickerID)
	})

	t.Run("Who Is Next", func(t *testing.T) {
		blind := NewBlind(pickOrder, cardsInBlind)

		nextPlayer := blind.WhoIsNext()
		assert.Equal(t, test.Player1, nextPlayer)

		blind.Pass()
		nextPlayer = blind.WhoIsNext()
		assert.Equal(t, test.Player2, nextPlayer)
	})

	t.Run("Is Complete", func(t *testing.T) {
		blind := NewBlind(pickOrder, cardsInBlind)

		assert.False(t, blind.IsComplete())

		blind.SetPickerID(test.Player1)
		assert.True(t, blind.IsComplete())

		blind = NewBlind(pickOrder, cardsInBlind)
		blind.Pass()
		blind.Pass()
		blind.Pass()
		assert.True(t, blind.IsComplete())
	})

	t.Run("Pick", func(t *testing.T) {
		blind := NewBlind(pickOrder, cardsInBlind)

		pickedCards := blind.Pick()
		assert.NotNil(t, pickedCards)
		assert.Equal(t, test.Player1, blind.PickerID)

		blind = NewBlind(pickOrder, cardsInBlind)
		blind.Pass()
		blind.Pass()
		blind.Pass()
		pickedCards = blind.Pick()
		assert.Nil(t, pickedCards)
	})

	t.Run("Pass", func(t *testing.T) {
		blind := NewBlind(pickOrder, cardsInBlind)

		blind.Pass()
		assert.Equal(t, 1, blind.Index)

		blind.Pass()
		assert.Equal(t, 2, blind.Index)

		blind.Pass()
		assert.Equal(t, 3, blind.Index)

		blind.Pass()
		assert.Equal(t, 3, blind.Index)
	})

	t.Run("Set Picker ID", func(t *testing.T) {
		blind := NewBlind(pickOrder, cardsInBlind)

		blind.SetPickerID(pickOrder[0])
		assert.Equal(t, pickOrder[0], blind.PickerID)
	})
}
