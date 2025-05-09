package hand

import (
	"main/domain/game/deck"
	"main/domain/game/test"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCountPoints(t *testing.T) {
	trick := NewTrick([]string{test.Player1, test.Player2, test.Player3})

	t.Run("no cards", func(t *testing.T) {
		points := deck.CountPoints(trick.ListCards())
		assert.Equal(t, 0, points)
	})

	t.Run("one card", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten)) // 10 points
		points := deck.CountPoints(trick.ListCards())
		assert.Equal(t, 10, points)
	})

	t.Run("multiple cards", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Jack))    // 2 points
		trick.PlayCard(deck.NewCard(deck.CardSuit.Diamond, deck.CardRank.Queen)) // 3 points
		points := deck.CountPoints(trick.ListCards())
		assert.Equal(t, 15, points)
	})
}

func TestWhoIsNext(t *testing.T) {
	trick := NewTrick([]string{test.Player1, test.Player2, test.Player3})

	t.Run("no card played", func(t *testing.T) {
		PlayerID := trick.WhoIsNext()
		assert.Equal(t, test.Player1, PlayerID)
	})

	t.Run("one card played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten))
		PlayerID := trick.WhoIsNext()
		assert.Equal(t, test.Player2, PlayerID)
	})
}

func TestGetLeadingCard(t *testing.T) {
	trick := NewTrick([]string{test.Player1, test.Player2, test.Player3})

	t.Run("no cards played", func(t *testing.T) {
		leadingCard := trick.GetLeadingCard()
		assert.Nil(t, leadingCard)
	})

	t.Run("card played", func(t *testing.T) {
		card := deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten)
		trick.PlayCard(card)
		leadingCard := trick.GetLeadingCard()
		assert.Equal(t, card, leadingCard)
	})
}

func TestGetLeadingSuit(t *testing.T) {
	trick := NewTrick([]string{test.Player1, test.Player2, test.Player3})

	t.Run("no cards played", func(t *testing.T) {
		leadingSuit := trick.GetLeadingSuit()
		assert.Equal(t, "", leadingSuit)
	})

	t.Run("card played", func(t *testing.T) {
		card := deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten)
		trick.PlayCard(card)
		leadingSuit := trick.GetLeadingSuit()
		assert.Equal(t, deck.CardSuit.Heart, leadingSuit)
	})
}

func TestGetTakerID(t *testing.T) {
	trick := NewTrick([]string{test.Player1, test.Player2, test.Player3})

	t.Run("no cards played", func(t *testing.T) {
		takerID := trick.GetTakerID()
		assert.Equal(t, "", takerID)
	})

	t.Run("one card played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten))
		takerID := trick.GetTakerID()
		assert.Equal(t, test.Player1, takerID)
	})

	t.Run("better card played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Jack))
		takerID := trick.GetTakerID()
		assert.Equal(t, test.Player2, takerID)
	})

	t.Run("worse card played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Club, deck.CardRank.Nine))
		takerID := trick.GetTakerID()
		assert.Equal(t, test.Player2, takerID)
	})
}

func TestIsComplete(t *testing.T) {
	trick := NewTrick([]string{test.Player1, test.Player2, test.Player3})

	t.Run("no cards played", func(t *testing.T) {
		assert.False(t, trick.IsComplete())
	})

	t.Run("all cards played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten))
		trick.PlayCard(deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Jack))
		trick.PlayCard(deck.NewCard(deck.CardSuit.Diamond, deck.CardRank.Queen))
		assert.True(t, trick.IsComplete())
	})
}

func TestPlayCard(t *testing.T) {
	trick := NewTrick([]string{test.Player1, test.Player2, test.Player3})
	card1 := deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten)
	card2 := deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Jack)
	card3 := deck.NewCard(deck.CardSuit.Diamond, deck.CardRank.Queen)

	t.Run("trick already complete", func(t *testing.T) {
		trick.PlayCard(card1)
		trick.PlayCard(card2)
		trick.PlayCard(card3)
		trick.PlayCard(deck.NewCard(deck.CardSuit.Club, deck.CardRank.Seven))
	})
}
