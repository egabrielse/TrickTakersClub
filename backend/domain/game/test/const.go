package test

import (
	"main/domain/game/deck"
	"math/rand"
)

const (
	Player1 = "player-1"
	Player2 = "player-2"
	Player3 = "player-3"
	Player4 = "player-4"
	Player5 = "player-5"
	Player6 = "player-6"
)

func MockNewDeck() *deck.Deck {
	cards := make([]*deck.Card, 0)
	for _, suit := range deck.CardSuits {
		for _, rank := range deck.CardRanks {
			cards = append(cards, deck.NewCard(suit, rank))
		}
	}
	rand.Seed(1)
	rand.Shuffle(len(cards), func(i, j int) {
		cards[i], cards[j] = cards[j], cards[i]
	})
	return &deck.Deck{Cards: cards}
}
