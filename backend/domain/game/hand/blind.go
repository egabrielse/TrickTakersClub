package hand

import "main/domain/game/deck"

type Blind struct {
	Index     int          `json:"index"`     // Index of the player who picked the blind
	PickOrder []string     `json:"pickOrder"` // Order of players starting with the dealer
	Cards     []*deck.Card `json:"cards"`     // Cards in the blind
	PickerID  string       `json:"pickerId"`  // ID of the player who picked the blind
}

func NewBlind(pickOrder []string, cards []*deck.Card) *Blind {
	return &Blind{
		Index:     0,
		Cards:     cards,
		PickOrder: pickOrder,
		PickerID:  "",
	}
}

func (b *Blind) WhoIsNext() (playerID string) {
	if b.Index < len(b.PickOrder) {
		return b.PickOrder[b.Index]
	}
	return ""
}

// Returns true if the blind is complete
// Player picked the blind or all players passed
func (b *Blind) IsComplete() (isComplete bool) {
	if b.PickerID != "" || b.Index == len(b.PickOrder) {
		return true
	}
	return false
}

func (b *Blind) Pick() []*deck.Card {
	if b.IsComplete() {
		return nil
	}
	b.PickerID = b.WhoIsNext()
	blind := b.Cards
	b.Cards = nil
	return blind
}

func (b *Blind) Pass() {
	if b.IsComplete() {
		return
	}
	b.Index++
}

func (b *Blind) SetPickerID(playerID string) {
	b.PickerID = playerID
}
