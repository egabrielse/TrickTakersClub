package deck

import (
	"testing"
)

func TestNewDeck(t *testing.T) {
	deck := NewDeck()
	if len(deck.Cards) != 32 {
		t.Errorf("Expected 32 cards, got %d", len(deck.Cards))
	}
}

func TestDraw(t *testing.T) {
	deck := NewDeck()
	cards := deck.Draw(12)

	if len(deck.Cards) != 27 {
		t.Errorf("Expected 27 cards, got %d", len(deck.Cards))
	}
	if len(cards) != 5 {
		t.Errorf("Expected 5 cards, got %d", len(cards))
	}
}
