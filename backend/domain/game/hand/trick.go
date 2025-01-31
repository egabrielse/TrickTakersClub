package hand

import (
	"main/domain/game/deck"
	"main/domain/game/summary"
	"main/utils"
)

type Trick struct {
	UpNextIndex int                   `json:"upNextIndex"`
	TakerID     string                `json:"takerId"`
	TurnOrder   []string              `json:"turnOrder"`
	Cards       map[string]*deck.Card `json:"cards"`
}

func NewTrick(turnOrder []string) *Trick {
	return &Trick{
		UpNextIndex: 0,
		TakerID:     "",
		TurnOrder:   turnOrder,
		Cards:       map[string]*deck.Card{},
	}
}

// Returns the player ID of the player who's turn it is to play a card
func (t *Trick) WhoIsNext() (playerID string) {
	if t.UpNextIndex < len(t.TurnOrder) {
		return t.TurnOrder[t.UpNextIndex]
	}
	return ""
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
	return t.TakerID
}

// Returns true if the trick is complete
func (t *Trick) IsComplete() (isComplete bool) {
	return len(t.Cards) == len(t.TurnOrder)
}

func (t *Trick) ListCards() []*deck.Card {
	return utils.MapValues(t.Cards)
}

// Plays a card in the trick
func (t *Trick) PlayCard(card *deck.Card) {
	if !t.IsComplete() {
		upNextID := t.WhoIsNext()
		t.Cards[upNextID] = card
		// Get the player ID of the player who is taking the trick
		if t.TakerID == "" || card.Compare(t.Cards[t.TakerID], t.GetLeadingSuit()) {
			t.TakerID = upNextID
		}
		t.UpNextIndex++
	}
}

func (t *Trick) SummarizeTrick() *summary.TrickSummary {
	return &summary.TrickSummary{
		TakerID:  t.GetTakerID(),
		Cards:    t.Cards,
		Points:   deck.CountPoints(t.ListCards()),
		Complete: t.IsComplete(),
	}
}
