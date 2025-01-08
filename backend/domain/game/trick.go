package game

import (
	"fmt"
	"main/domain/game/deck"
)

type Trick struct {
	UpNextIndex int          `json:"upNextIndex"`
	TakerIndex  int          `json:"takerIndex"`
	TurnOrder   []string     `json:"turnOrder"`
	Cards       []*deck.Card `json:"cards"`
}

func NewTrick(turnOrder []string) *Trick {
	return &Trick{
		UpNextIndex: 0,
		TakerIndex:  -1,
		TurnOrder:   turnOrder,
		Cards:       []*deck.Card{},
	}
}

// Returns the total amount of points in the trick
func (t *Trick) CountPoints() (points int) {
	points = 0
	for _, card := range t.Cards {
		points += card.GetPoints()
	}
	return points
}

// Returns the player ID of the player who's turn it is to play a card
func (t *Trick) WhoIsNext() (playerID string) {
	if t.UpNextIndex < len(t.TurnOrder) {
		return t.TurnOrder[t.UpNextIndex]
	}
	return ""
}

// Returns the card that was played first in the trick
func (t *Trick) GetLeadingCard() (card *deck.Card) {
	if len(t.Cards) == 0 {
		return nil
	}
	return t.Cards[0]
}

// Returns the suit of the card that was played first in the trick
func (t *Trick) GetLeadingSuit() (suit string) {
	if card := t.GetLeadingCard(); card == nil {
		return ""
	} else {
		return card.Suit
	}
}

// Returns the player ID of the player who is taking the trick
func (t *Trick) GetTakerID() (playerID string) {
	if t.TakerIndex != -1 {
		return t.TurnOrder[t.TakerIndex]
	}
	return ""
}

// Returns true if the trick is complete
func (t *Trick) IsComplete() (isComplete bool) {
	return len(t.Cards) == len(t.TurnOrder)
}

// Plays a card in the trick
func (t *Trick) PlayCard(card *deck.Card) error {
	if t.IsComplete() {
		return fmt.Errorf("trick is already complete")
	} else {
		t.Cards = append(t.Cards, card)
		if t.TakerIndex == -1 || card.Compare(t.Cards[t.TakerIndex], t.GetLeadingSuit()) {
			t.TakerIndex = t.UpNextIndex
		}
		t.UpNextIndex++
		return nil
	}
}
