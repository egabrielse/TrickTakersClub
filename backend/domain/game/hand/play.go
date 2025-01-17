package hand

import (
	"main/domain/game/deck"
	"main/domain/game/summary"
	"main/utils"
)

type Play struct {
	HandOrder   []string `json:"handOrder"`   // Order of players in the hand (used for first trick)
	Tricks      []*Trick `json:"tricks"`      // Tricks played in the hand
	TotalTricks int      `json:"totalTricks"` // Total number of tricks in the hand
}

func NewPlay(handOrder []string, totalTricks int) *Play {
	return &Play{
		HandOrder:   handOrder,
		TotalTricks: totalTricks,
		Tricks: []*Trick{
			NewTrick(handOrder),
		},
	}
}

// Returns the current trick in play
func (p *Play) GetCurrentTrick() *Trick {
	// Assumes that there is at least one trick (ensured by NewPlay)
	return p.Tricks[len(p.Tricks)-1]
}

// Returns true if all tricks have been played out
func (p *Play) IsComplete() (isComplete bool) {
	trick := p.GetCurrentTrick()
	if len(p.Tricks) == p.TotalTricks && trick.IsComplete() {
		// All tricks have been played out
		return true
	}
	return false
}

func (p *Play) CountPlayedTricks() int {
	trick := p.GetCurrentTrick()
	if trick.IsComplete() {
		return len(p.Tricks)
	}
	return len(p.Tricks) - 1
}

func (p *Play) WhoIsNext() (playerID string) {
	trick := p.GetCurrentTrick()
	return trick.WhoIsNext()
}

// Plays a card in the current trick
// Returns a summary of the trick if it is complete, otherwise returns nil
func (p *Play) PlayCard(card *deck.Card) *summary.TrickSummary {
	trick := p.GetCurrentTrick()
	trick.PlayCard(card)
	if trick.IsComplete() {
		summary := trick.SummarizeTrick()
		if !p.IsComplete() {
			// If the hand is not yet complete, start the next trick
			takerID := trick.GetTakerID()
			trickOrder := utils.RelistStartingWith(trick.TurnOrder, takerID)
			newTrick := NewTrick(trickOrder)
			p.Tricks = append(p.Tricks, newTrick)
		}
		return summary
	}
	return nil
}

func (p *Play) SummarizeTricks() (summaries []*summary.TrickSummary) {
	summaries = []*summary.TrickSummary{}
	for _, trick := range p.Tricks {
		summary := trick.SummarizeTrick()
		if summary.Complete {
			summaries = append(summaries, summary)
		}
	}
	return summaries
}
