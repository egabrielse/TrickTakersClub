package game

import (
	"main/domain/game/deck"
	"main/utils"
)

type Players struct {
	Hands map[string][]*deck.Card `json:"hands"` // Player hands
}

func NewPlayers(playerIDs []string) *Players {
	hands := map[string][]*deck.Card{}
	for _, id := range playerIDs {
		hands[id] = []*deck.Card{}
	}
	return &Players{
		Hands: hands,
	}
}

func (p *Players) GetHand(playerID string) []*deck.Card {
	return p.Hands[playerID]
}

func (p *Players) SetHand(playerID string, hand []*deck.Card) {
	p.Hands[playerID] = hand
}

func (p *Players) WhoHas(card *deck.Card) string {
	for id, hand := range p.Hands {
		for _, c := range hand {
			if *c == *card {
				return id
			}
		}
	}
	return ""
}

func (p *Players) RemoveCard(playerID string, card *deck.Card) {
	hand := p.Hands[playerID]
	filtered := utils.Filter(hand, func(c *deck.Card) bool {
		return *c != *card
	})
	p.Hands[playerID] = filtered
}

func (p *Players) HandContains(playerID string, cards []*deck.Card) bool {
	hand := p.Hands[playerID]
	for _, card := range cards {
		if !utils.Contains(hand, card) {
			return false
		}
	}
	return true
}
