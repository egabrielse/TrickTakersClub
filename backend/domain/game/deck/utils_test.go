package deck

import (
	"testing"
)

func TestCountPoints(t *testing.T) {
	cards := []*Card{
		NewCard(CardSuit.Heart, CardRank.Nine),  // 0
		NewCard(CardSuit.Heart, CardRank.Eight), // 0
		NewCard(CardSuit.Heart, CardRank.Nine),  // 0
		NewCard(CardSuit.Heart, CardRank.Ten),   // 10
		NewCard(CardSuit.Heart, CardRank.Jack),  // 2
		NewCard(CardSuit.Heart, CardRank.Queen), // 3
		NewCard(CardSuit.Heart, CardRank.King),  // 4
		NewCard(CardSuit.Heart, CardRank.Ace),   // 11
	}
	points := CountPoints(cards)
	if points != 30 {
		t.Errorf("Expected 30 points, got %d", points)
	}
}
