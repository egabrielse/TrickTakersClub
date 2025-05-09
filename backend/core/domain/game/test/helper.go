package test

import (
	"fmt"
	"main/domain/game/deck"
	"math/rand"
)

func CreateListOfPlayers(numPlayers int) []string {
	players := make([]string, 0)
	for i := 0; i < numPlayers; i++ {
		players = append(players, fmt.Sprintf("player-%d", i+1))
	}
	return players
}

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
