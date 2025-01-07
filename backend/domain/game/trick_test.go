package game

import (
	"main/domain/game/deck"
	"testing"

	"github.com/stretchr/testify/assert"
)

const Player1 = "player1"
const Player2 = "player2"
const Player3 = "player3"

var Players = []string{Player1, Player2, Player3}

func TestCountPoints(t *testing.T) {
	trick := NewTrick(Players)

	t.Run("no cards", func(t *testing.T) {
		points := trick.CountPoints()
		assert.Equal(t, 0, points, "expected 0 points")
	})

	t.Run("one card", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten)) // 10 points
		points := trick.CountPoints()
		assert.Equal(t, 10, points, "expected 10 points")
	})

	t.Run("multiple cards", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Jack))    // 2 points
		trick.PlayCard(deck.NewCard(deck.CardSuit.Diamond, deck.CardRank.Queen)) // 3 points
		points := trick.CountPoints()
		assert.Equal(t, 15, points, "expected 15 points")
	})
}

func TestGetUpNextID(t *testing.T) {
	trick := NewTrick(Players)

	t.Run("no card played", func(t *testing.T) {
		playerID := trick.GetUpNextID()
		assert.Equal(t, Player1, playerID, "expected Player1")
	})

	t.Run("one card played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten))
		playerID := trick.GetUpNextID()
		assert.Equal(t, Player2, playerID, "expected Player2")
	})
}

func TestGetLeadingCard(t *testing.T) {
	trick := NewTrick(Players)

	t.Run("no cards played", func(t *testing.T) {
		leadingCard := trick.GetLeadingCard()
		assert.Nil(t, leadingCard, "expected nil")
	})

	t.Run("card played", func(t *testing.T) {
		card := deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten)
		trick.PlayCard(card)
		leadingCard := trick.GetLeadingCard()
		assert.Equal(t, card, leadingCard, "expected ten of hearts to take lead")
	})
}

func TestGetLeadingSuit(t *testing.T) {
	trick := NewTrick(Players)

	t.Run("no cards played", func(t *testing.T) {
		leadingSuit := trick.GetLeadingSuit()
		assert.Equal(t, "", leadingSuit, "expected empty string")
	})

	t.Run("card played", func(t *testing.T) {
		card := deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten)
		trick.PlayCard(card)
		leadingSuit := trick.GetLeadingSuit()
		assert.Equal(t, deck.CardSuit.Heart, leadingSuit, "expected leading suit to be Heart")
	})
}

func TestGetTakerID(t *testing.T) {
	trick := NewTrick(Players)

	t.Run("no cards played", func(t *testing.T) {
		takerID := trick.GetTakerID()
		assert.Equal(t, "", takerID, "expected empty string")
	})

	t.Run("one card played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten))
		takerID := trick.GetTakerID()
		assert.Equal(t, Player1, takerID, "expected Player1")
	})

	t.Run("better card played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Jack))
		takerID := trick.GetTakerID()
		assert.Equal(t, Player2, takerID, "expected Player2")
	})

	t.Run("worse card played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Club, deck.CardRank.Nine))
		takerID := trick.GetTakerID()
		assert.Equal(t, Player2, takerID, "expected Player2")
	})
}

func TestIsComplete(t *testing.T) {
	trick := NewTrick(Players)

	t.Run("no cards played", func(t *testing.T) {
		assert.False(t, trick.IsComplete(), "expected trick to be incomplete")
	})

	t.Run("all cards played", func(t *testing.T) {
		trick.PlayCard(deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten))
		trick.PlayCard(deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Jack))
		trick.PlayCard(deck.NewCard(deck.CardSuit.Diamond, deck.CardRank.Queen))
		assert.True(t, trick.IsComplete(), "expected trick to be complete")
	})
}

func TestPlayCard(t *testing.T) {
	trick := NewTrick(Players)
	card1 := deck.NewCard(deck.CardSuit.Heart, deck.CardRank.Ten)
	card2 := deck.NewCard(deck.CardSuit.Spade, deck.CardRank.Jack)
	card3 := deck.NewCard(deck.CardSuit.Diamond, deck.CardRank.Queen)

	t.Run("trick already complete", func(t *testing.T) {
		trick.PlayCard(card1)
		trick.PlayCard(card2)
		trick.PlayCard(card3)
		err := trick.PlayCard(deck.NewCard(deck.CardSuit.Club, deck.CardRank.Seven))
		assert.NotNil(t, err, "expected error, got nil")
	})
}
