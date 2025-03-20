package hand

import "main/domain/game/deck"

type Bury struct {
	Cards []*deck.Card `json:"cards"` // Cards in the bury
}

func NewBury() *Bury {
	return &Bury{
		Cards: []*deck.Card{},
	}
}

func (b *Bury) IsComplete() (isComplete bool) {
	return len(b.Cards) > 0
}

func (b *Bury) BuryCards(cards []*deck.Card) {
	b.Cards = cards
}

func (b *Bury) Contains(cards []*deck.Card) bool {
	for _, cardToFind := range cards {
		found := false
		for _, buriedCard := range b.Cards {
			if *cardToFind == *buriedCard {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return true
}

func (b *Bury) CountPoints() (points int) {
	if !b.IsComplete() {
		return 0
	}
	return deck.CountPoints(b.Cards)
}
