package deck

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCompareCards(t *testing.T) {
	t.Run("Trump vs Non-Trump", func(t *testing.T) {
		trump := NewCard(CardSuit.Diamond, CardRank.Jack)
		nonTrump := NewCard(CardSuit.Spade, CardRank.Seven)

		assert.True(t, trump.Compare(nonTrump, ""), "Expected trump to be greater than non-trump")
	})

	t.Run("Non-Trump vs Trump", func(t *testing.T) {
		nonTrump := NewCard(CardSuit.Spade, CardRank.Seven)
		trump := NewCard(CardSuit.Diamond, CardRank.Jack)

		assert.False(t, nonTrump.Compare(trump, ""), "Expected non-trump to be less than trump")
	})

	t.Run("Trump vs Leading Suit", func(t *testing.T) {
		trump := NewCard(CardSuit.Diamond, CardRank.Jack)
		leadingSuit := CardSuit.Heart
		seven := NewCard(CardSuit.Heart, CardRank.Seven)

		assert.True(t, trump.Compare(seven, leadingSuit), "Expected trump to be greater than seven")
	})

	t.Run("Same Suit", func(t *testing.T) {
		leadingSuit := CardSuit.Heart
		seven := NewCard(CardSuit.Heart, CardRank.Seven)
		eight := NewCard(CardSuit.Heart, CardRank.Eight)

		assert.True(t, eight.Compare(seven, leadingSuit), "Expected eight to be greater than seven")
	})

	t.Run("Leading Suit vs Non-Leading Suit", func(t *testing.T) {
		leadingSuit := CardSuit.Heart
		heart := NewCard(CardSuit.Heart, CardRank.Seven)
		spade := NewCard(CardSuit.Spade, CardRank.Ace)

		assert.True(t, heart.Compare(spade, leadingSuit), "Expected seven to be greater than ace of spades")
	})

	t.Run("Trump vs Trump", func(t *testing.T) {
		jackOfDiamonds := NewCard(CardSuit.Diamond, CardRank.Jack)
		queenOfClubs := NewCard(CardSuit.Club, CardRank.Queen)

		assert.True(t, queenOfClubs.Compare(jackOfDiamonds, CardSuit.Diamond), "Expected queen to be greater than jack")
	})
}
