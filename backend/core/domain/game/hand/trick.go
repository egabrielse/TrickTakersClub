package hand

import (
	"main/domain/game/deck"
	"main/utils"
)

type Trick struct {
	TurnOrder []string              `json:"turnOrder"`
	Cards     map[string]*deck.Card `json:"cards"`
}

func NewTrick(turnOrder []string) *Trick {
	return &Trick{
		TurnOrder: turnOrder,
		Cards:     map[string]*deck.Card{},
	}
}

// Returns the player ID of the player who's turn it is to play a card
func (t *Trick) WhoIsNext() (playerID string) {
	if len(t.Cards) == len(t.TurnOrder) {
		return ""
	}
	return t.TurnOrder[len(t.Cards)]
}

// Returns the card that was played first in the trick
func (t *Trick) GetLeadingCard() (card *deck.Card) {
	return t.Cards[t.TurnOrder[0]]
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
	takerID := ""
	for playerID, card := range t.Cards {
		if takerID == "" || card.Compare(t.Cards[takerID], t.GetLeadingSuit()) {
			takerID = playerID
		}
	}
	return takerID
}

func (t *Trick) IsComplete() (isComplete bool) {
	return len(t.Cards) == len(t.TurnOrder)
}

func (t *Trick) ListCards() []*deck.Card {
	return utils.MapValues(t.Cards)
}

func (t *Trick) PlayCard(card *deck.Card) {
	if !t.IsComplete() {
		upNextID := t.WhoIsNext()
		t.Cards[upNextID] = card
	}
}

func (t *Trick) CountPoints() int {
	return deck.CountPoints(t.ListCards())
}
