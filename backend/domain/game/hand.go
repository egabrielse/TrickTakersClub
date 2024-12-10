package game

import (
	"fmt"
	"main/domain/game/deck"
	"main/domain/game/score"
	"main/utils"
)

type Hand struct {
	Blind           []*deck.Card `json:"blind"`           // Blind cards
	CalledCard      *deck.Card   `json:"calledCard"`      // Card called by the picker
	PartnerID       string       `json:"partnerId"`       // Partner of the picker
	Phase           string       `json:"phase"`           // Phase of the hand
	PickOrPassIndex int          `json:"pickOrPassIndex"` // Index of the player who's turn it is to pick or pass
	PickerID        string       `json:"pickerId"`        // Player who picked the blind
	PlayerOrder     []string     `json:"playerOrder"`     // Order of players at the table
	TotalTricks     int          `json:"totalTricks"`     // Total number of tricks in the hand
	Tricks          []*Trick     `json:"tricks"`          // Tricks played in the hand
}

func NewHand(playerIDs []string, totalTricks int, blind []*deck.Card) (hand *Hand) {
	return &Hand{
		Blind:           blind,
		Phase:           HandPhase.Pick,
		PickOrPassIndex: 1, // Picking starts with the player to the left of the dealer (index 1)
		PlayerOrder:     playerIDs,
		TotalTricks:     totalTricks,
		Tricks:          []*Trick{},
	}
}

func (h *Hand) GetThisTrick() *Trick {
	if h.Tricks == nil || len(h.Tricks) == 0 {
		return nil
	}
	return h.Tricks[len(h.Tricks)-1]
}

func (h *Hand) GetLastTrick() *Trick {
	if h.Tricks == nil || len(h.Tricks) < 2 {
		return nil
	}
	return h.Tricks[len(h.Tricks)-2]
}

func (h *Hand) CountPlayedTricks() int {
	trick := h.GetThisTrick()
	if trick == nil {
		return 0
	} else if trick.IsComplete() {
		return len(h.Tricks)
	} else {
		return len(h.Tricks) - 1
	}
}

func (h *Hand) WhoIsNext() (playerID string) {
	switch h.Phase {
	case HandPhase.Pick:
		return h.PlayerOrder[h.PickOrPassIndex]
	case HandPhase.Bury, HandPhase.Call:
		return h.PickerID
	case HandPhase.Play:
		if trick := h.GetThisTrick(); trick != nil {
			return trick.GetUpNextID()
		}
	}
	return ""
}

func (h *Hand) IsComplete() (isComplete bool) {
	if len(h.Tricks) == h.TotalTricks {
		trick := h.GetThisTrick()
		if trick != nil && trick.IsComplete() {
			return true
		}
	}
	return false
}

func (h *Hand) StartNextTrick() {
	// Set the phase to play
	h.Phase = HandPhase.Play
	// Start the next trick
	trick := h.GetThisTrick()
	if trick == nil {
		// First trick: Player left of the dealer starts the first trick.
		playOrder := utils.RelistStartingWith(h.PlayerOrder, h.PlayerOrder[1])
		newTrick := NewTrick(playOrder)
		h.Tricks = append(h.Tricks, newTrick)
	} else {
		// Subsequent tricks: Start with the taker of the previous trick.
		takerID := trick.GetTakerID()
		playOrder := utils.RelistStartingWith(h.PlayerOrder, takerID)
		newTrick := NewTrick(playOrder)
		h.Tricks = append(h.Tricks, newTrick)
	}
}

func (h *Hand) PickOrPass(player *Player, pick bool) error {
	if h.Phase != HandPhase.Pick {
		return fmt.Errorf("not in pick phase")
	} else if pick {
		player.TakeCards(h.Blind)
		player.SetRole(PlayerRole.Picker)
		h.PickerID = player.PlayerID
		h.Blind = []*deck.Card{}
		// TODO: Change to PhaseCall when playing 5 player
		h.Phase = HandPhase.Bury
	} else if h.PickOrPassIndex == len(h.PlayerOrder)-1 {
		// All other players passed, so the dealer must pick (screw the dealer)
		h.PickOrPassIndex = 0
	} else {
		// Otherwise, move to the next player
		h.PickOrPassIndex++
	}
	return nil
}

// TODO: logic for blitzing
func (h *Hand) Call(picker *Player, players map[string]*Player, card *deck.Card) error {
	if h.Phase != HandPhase.Call {
		return fmt.Errorf("not in bury phase")
	} else if picker.Role != PlayerRole.Picker {
		return fmt.Errorf("%s not the picker", picker.PlayerID)
	} else {
		h.CalledCard = card
		for _, player := range players {
			if player.Role == PlayerRole.Picker {
				continue
			} else if player.HasCard(card) {
				player.SetRole(PlayerRole.Partner)
				h.PartnerID = player.PlayerID
			} else {
				player.SetRole(PlayerRole.Opponent)
			}
		}
		h.Phase = HandPhase.Bury
		return nil
	}
}

func (h *Hand) Bury(picker *Player, cards []*deck.Card) error {
	if h.Phase != HandPhase.Bury {
		return fmt.Errorf("not in bury phase")
	} else if picker.Role != PlayerRole.Picker {
		return fmt.Errorf("%s not the picker", picker.PlayerID)
	} else {
		picker.BuryCards(cards)
		h.StartNextTrick()
		return nil
	}
}

func (h *Hand) Play(player *Player, card *deck.Card) error {
	if h.Phase != HandPhase.Play {
		return fmt.Errorf("not in play phase")
	} else if trick := h.GetThisTrick(); trick == nil {
		return fmt.Errorf("trick not started")
	} else if trick.IsComplete() {
		return fmt.Errorf("trick already complete")
	} else if err := player.RemoveCard(card); err != nil {
		return err
	} else {
		trick.PlayCard(card)
		if trick.IsComplete() {
			if h.IsComplete() {
				// Hand is complete, move to scoring phase
				h.Phase = HandPhase.Score
			} else {
				// Start the next trick
				h.StartNextTrick()
			}
		}
		return nil
	}
}

func (h *Hand) SummarizeHand(players map[string]*Player) *HandSummary {
	sum := NewHandSummary(h.PlayerOrder)
	points := map[string]int{}
	tricks := map[string]int{}

	for playerID, player := range players {
		points[playerID] = 0
		tricks[playerID] = 0
		if player.Role == PlayerRole.Picker {
			sum.PickerID = playerID
			buriedPoints := 0
			for _, card := range player.Bury {
				buriedPoints += card.GetPoints()
			}
			points[playerID] = buriedPoints
			sum.BurySummary = BurySummary{
				Cards:  player.Bury,
				Points: buriedPoints,
			}
		} else if player.Role == PlayerRole.Partner {
			sum.PartnerID = playerID
		}
	}

	for _, trick := range h.Tricks {
		takerID := trick.GetTakerID()
		trickPoints := trick.CountPoints()
		tricks[takerID] += 1
		points[takerID] += trickPoints
		sum.TrickSums = append(sum.TrickSums, TrickSummary{
			TakerID: takerID,
			Cards:   trick.Cards,
			Points:  trickPoints,
		})
	}
	sum.PointsWon = points
	sum.TricksWon = tricks

	sum.PickerWon = (points[sum.PickerID] + points[sum.PartnerID]) > score.PointsHalf
	sum.Scores = score.ScoreTriosHand(sum.PickerID, sum.PartnerID, h.TotalTricks, points, tricks)
	return sum
}
