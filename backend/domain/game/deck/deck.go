package deck

import "math/rand"

type Deck struct {
	Cards []*Card `json:"cards"`
}

func NewDeck() *Deck {
	cards := make([]*Card, 0)
	for _, suit := range CardSuits {
		for _, rank := range CardRanks {
			cards = append(cards, NewCard(suit, rank))
		}
	}
	rand.Shuffle(len(cards), func(i, j int) {
		cards[i], cards[j] = cards[j], cards[i]
	})

	return &Deck{Cards: cards}
}

func (d *Deck) Draw(count int) []*Card {
	if count > len(d.Cards) {
		count = len(d.Cards)
	}
	cards := d.Cards[:count]
	d.Cards = d.Cards[count:]
	return cards
}
