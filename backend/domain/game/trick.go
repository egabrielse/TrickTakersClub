package game

import (
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

func (t *Trick) CountPoints() (points int) {
	points = 0
	for index, card := range t.Cards {
		if index < t.UpNextIndex {
			points += card.GetPoints()
		} else {
			break
		}
	}
	return points
}

func (t *Trick) GetUpNextID() (playerID string) {
	if t.UpNextIndex < len(t.TurnOrder) {
		return t.TurnOrder[t.UpNextIndex]
	}
	return ""
}

func (t *Trick) GetLeadingCard() (card *deck.Card) {
	if len(t.Cards) == 0 {
		return nil
	}
	return t.Cards[0]
}

func (t *Trick) GetLeadingSuit() (suit string) {
	if card := t.GetLeadingCard(); card == nil {
		return ""
	} else {
		return card.Suit
	}
}

func (t *Trick) GetTakerID() (playerID string) {
	if t.TakerIndex != -1 {
		return t.TurnOrder[t.TakerIndex]
	}
	return ""
}

func (t *Trick) IsComplete() (isComplete bool) {
	return len(t.Cards) == len(t.TurnOrder)
}

func (t *Trick) PlayCard(card *deck.Card) {
	t.Cards = append(t.Cards, card)
	if t.TakerIndex == -1 || card.Compare(t.Cards[t.TakerIndex], t.GetLeadingSuit()) {
		t.TakerIndex = t.UpNextIndex
	}
	t.UpNextIndex++
}
