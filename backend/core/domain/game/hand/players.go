package hand

import (
	"main/domain/game/deck"
	"main/utils"
)

type PlayerHands struct {
	Hands map[string][]*deck.Card `json:"hands"` // Player hands
}

func NewPlayerHands(playerIDs []string) *PlayerHands {
	hands := map[string][]*deck.Card{}
	for _, id := range playerIDs {
		hands[id] = []*deck.Card{}
	}
	return &PlayerHands{
		Hands: hands,
	}
}

func (p *PlayerHands) GetHand(playerID string) []*deck.Card {
	return p.Hands[playerID]
}

func (p *PlayerHands) SetHand(playerID string, hand []*deck.Card) {
	p.Hands[playerID] = hand
}

func (p *PlayerHands) WhoHas(card *deck.Card) string {
	for id, hand := range p.Hands {
		for _, c := range hand {
			if *c == *card {
				return id
			}
		}
	}
	return ""
}

func (p *PlayerHands) RemoveCard(playerID string, card *deck.Card) {
	hand := p.Hands[playerID]
	filtered := utils.Filter(hand, func(c *deck.Card) bool {
		return *c != *card
	})
	p.Hands[playerID] = filtered
}

func (p *PlayerHands) RemoveCards(playerID string, cards []*deck.Card) {
	for _, card := range cards {
		p.RemoveCard(playerID, card)
	}
}

func (p *PlayerHands) Contains(playerID string, cards []*deck.Card) bool {
	hand := p.Hands[playerID]
	for _, cardToFind := range cards {
		found := false
		for _, cardInHand := range hand {
			if *cardToFind == *cardInHand {
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
