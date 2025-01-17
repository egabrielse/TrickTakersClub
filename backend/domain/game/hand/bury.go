package hand

import "main/domain/game/deck"

type Bury struct {
	BlindSize int          `json:"blindSize"` // Number of cards to bury
	Cards     []*deck.Card `json:"cards"`     // Cards in the bury
}

func NewBury(blindSize int) *Bury {
	return &Bury{
		BlindSize: blindSize,
		Cards:     []*deck.Card{},
	}
}

func (b *Bury) IsComplete() (isComplete bool) {
	return len(b.Cards) > 0
}

func (b *Bury) BuryCards(cards []*deck.Card) {
	b.Cards = cards
}

func (b *Bury) CountPoints() (points int) {
	if !b.IsComplete() {
		return 0
	}
	return deck.CountPoints(b.Cards)
}
