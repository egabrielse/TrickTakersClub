package game

import (
	"fmt"
	"main/domain/game/deck"
	"main/utils"
)

type Player struct {
	PlayerID string       `json:"playerId"` // Player ID
	Role     string       `json:"role"`     // Player role
	Hand     []*deck.Card `json:"hand"`     // Cards in the player's hand
	Bury     []*deck.Card `json:"bury"`     // Picker's buried cards
}

func NewPlayer(playerId string, hand []*deck.Card) *Player {
	return &Player{
		PlayerID: playerId,
		Hand:     hand,
		Bury:     []*deck.Card{},
	}
}

func (p *Player) SetRole(role string) {
	p.Role = role
}

func (p *Player) HasCard(card *deck.Card) bool {
	for _, c := range p.Hand {
		if *card == *c {
			return true
		}
	}
	return false
}

func (p *Player) TakeCards(cards []*deck.Card) {
	p.Hand = append(p.Hand, cards...)
}

func (p *Player) RemoveCard(card *deck.Card) error {
	cardFound := false
	newHand := []*deck.Card{}
	// Check if the card is in the hand
	for _, c := range p.Hand {
		// Compare values of the cards
		if *c != *card {
			newHand = append(newHand, c)
		} else {
			cardFound = true
		}
	}
	if cardFound {
		p.Hand = newHand
		return nil
	}
	return fmt.Errorf("card %s of %s not found in hand", card.Rank, card.Suit)
}

func (p *Player) BuryCards(cards []*deck.Card) error {
	// Remove bury cards from the hand
	for _, cardToBury := range cards {
		if err := p.RemoveCard(cardToBury); utils.LogOnError(err) {
			return err
		}
	}
	// Add cards to the bury pile
	p.Bury = append(p.Bury, cards...)
	return nil
}
