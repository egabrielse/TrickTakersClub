package game

import (
	"fmt"
	"main/domain/game/deck"
	"main/domain/game/scoring"
	"main/utils"
)

type Hand struct {
	Blind           []*deck.Card       `json:"blind"`           // Blind cards
	CalledCard      *deck.Card         `json:"calledCard"`      // Card called by the picker
	HandOrder       []string           `json:"handOrder"`       // Order of players starting with the dealer
	PartnerID       string             `json:"partnerId"`       // Partner of the picker
	Phase           string             `json:"phase"`           // Phase of the hand
	PickIndex       int                `json:"PickIndex"`       // Index of the player who's turn it is to pick or pass
	PickerID        string             `json:"pickerId"`        // Player who picked the blind
	Players         map[string]*Player `json:"players"`         // Player hands
	Settings        *GameSettings      `json:"settings"`        // Game settings
	TotalTricks     int                `json:"totalTricks"`     // Total number of tricks in the hand
	Tricks          []*Trick           `json:"tricks"`          // Tricks played in the hand
	ScoringMethod   string             `json:"scoringMethod"`   // Method to use for scoring the hand
	ScoreMultiplier int                `json:"scoreMultiplier"` // TODO: Multiplier to apply to the hand score
}

func NewHand(handOrder []string, deck *deck.Deck, settings *GameSettings) (hand *Hand) {
	handSize, blindSize := settings.DeriveHandBlindSize()
	players := map[string]*Player{}
	for _, playerID := range handOrder {
		hand := deck.Draw(handSize)
		players[playerID] = NewPlayer(playerID, hand)
	}
	return &Hand{
		Blind:           deck.Draw(blindSize),
		Phase:           HandPhase.Pick,
		Players:         players,
		PickIndex:       1, // Picking starts with the player to the left of the dealer (index 1)
		HandOrder:       handOrder,
		TotalTricks:     handSize,
		Tricks:          []*Trick{},
		Settings:        settings,
		ScoringMethod:   "default",
		ScoreMultiplier: 1,
	}
}

func (h *Hand) GetCurrentTrick() *Trick {
	if len(h.Tricks) == 0 {
		return nil
	}
	return h.Tricks[len(h.Tricks)-1]
}

func (h *Hand) CountPlayedTricks() int {
	trick := h.GetCurrentTrick()
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
		return h.HandOrder[h.PickIndex]
	case HandPhase.Bury, HandPhase.Call:
		return h.PickerID
	case HandPhase.Play:
		if trick := h.GetCurrentTrick(); trick != nil {
			return trick.WhoIsNext()
		}
	}
	return ""
}

func (h *Hand) ValidateUpNext(playerID string) (*Player, error) {
	if player := h.Players[playerID]; player == nil {
		return nil, fmt.Errorf("player not found")
	} else if player.PlayerID != h.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else {
		return player, nil
	}
}

func (h *Hand) IsComplete() (isComplete bool) {
	if len(h.Tricks) == h.TotalTricks {
		trick := h.GetCurrentTrick()
		if trick != nil && trick.IsComplete() {
			return true
		}
	}
	return false
}

func (h *Hand) StartNextTrick() {
	// Start the next trick
	trick := h.GetCurrentTrick()
	if trick == nil {
		// First trick: Player left of the dealer starts the first trick.
		trickOrder := utils.RelistStartingWith(h.HandOrder, h.HandOrder[1])
		newTrick := NewTrick(trickOrder)
		h.Tricks = append(h.Tricks, newTrick)
	} else {
		// Subsequent tricks: Start with the taker of the previous trick.
		takerID := trick.GetTakerID()
		trickOrder := utils.RelistStartingWith(h.HandOrder, takerID)
		newTrick := NewTrick(trickOrder)
		h.Tricks = append(h.Tricks, newTrick)
	}
}

func (h *Hand) SummarizeHand() *HandSummary {
	sum := NewHandSummary(h.HandOrder)
	points := map[string]int{}
	tricks := map[string]int{}
	for _, playerID := range h.HandOrder {
		points[playerID] = 0
		tricks[playerID] = 0
	}

	// Count up the points in the tricks
	for _, trick := range h.Tricks {
		trickSum := trick.SummarizeTrick()
		tricks[trickSum.TakerID] += 1
		points[trickSum.TakerID] += trickSum.Points
		sum.TrickSums = append(sum.TrickSums, trickSum)
	}

	// Calculate the hand summary
	switch h.ScoringMethod {
	case NoPickResolution.Leasters:
		// Leasters Hand (No Picker)
		sum.PointsWon = points
		sum.TricksWon = tricks
		sum.Scores, sum.Winners = scoring.ScoreLeastersHand(points, tricks)
	case NoPickResolution.Mosters:
		// Mosters Hand (No Picker)
		sum.PointsWon = points
		sum.TricksWon = tricks
		sum.Scores, sum.Winners = scoring.ScoreMostersHand(points)
	default:
		// Someone picked, score hand normally
		sum.PickerID = h.PickerID
		player := h.Players[h.PickerID]

		// Count up the points in the bury and add to the picker's points
		points[h.PickerID] += deck.CountPoints(player.Bury)
		sum.BurySummary = BurySummary{Cards: player.Bury, Points: points[h.PickerID]}

		sum.PointsWon = points
		sum.TricksWon = tricks
		sum.Scores, sum.Winners = scoring.ScoreHand(h.PickerID, h.PartnerID, points, tricks, h.Settings.DoubleOnTheBump)
	}
	return sum
}

func (h *Hand) PickOrPass(playerId string, pick bool) (*PickOrPassResult, error) {
	result := &PickOrPassResult{}
	if h.Phase != HandPhase.Pick {
		return nil, fmt.Errorf("not in pick phase")
	} else if player, err := h.ValidateUpNext(playerId); err != nil {
		return nil, err
	} else if pick {
		// Player picked the blind
		result.PickedCards = h.Blind
		result.PickerID = player.PlayerID
		player.TakeCards(h.Blind)
		player.SetRole(PlayerRole.Picker)
		h.PickerID = player.PlayerID
		h.Blind = []*deck.Card{}
		h.Phase = HandPhase.Bury
	} else if h.PickIndex == len(h.HandOrder)-1 && h.Settings.NoPickResolution == NoPickResolution.ScrewTheDealer {
		// Dealer is forced to pick (Screw the Dealer)
		dealer := h.Players[h.HandOrder[0]]
		result.PickedCards = h.Blind
		result.PickerID = dealer.PlayerID
		dealer.TakeCards(h.Blind)
		dealer.SetRole(PlayerRole.Picker)
		h.PickerID = dealer.PlayerID
		h.Blind = []*deck.Card{}
		h.Phase = HandPhase.Bury
	} else if h.PickIndex == 0 {
		// Dealer passed, move onto no-pick resolutions
		if h.Settings.NoPickResolution == NoPickResolution.Doublers {
			// Hand is restarted with the stakes doubled
			return nil, fmt.Errorf("re-deal hand and double the stakes")
		} else {
			// Play the hand with no picker (leasters or mosters)
			h.ScoringMethod = h.Settings.NoPickResolution
		}
	} else {
		// Move to the next person
		h.PickIndex = (h.PickIndex + 1) % len(h.HandOrder)
	}

	return result, nil
}

func (h *Hand) Bury(playerId string, cards []*deck.Card) (*BuryResult, error) {
	result := &BuryResult{}
	if h.Phase != HandPhase.Bury {
		return nil, fmt.Errorf("not in bury phase")
	} else if picker, err := h.ValidateUpNext(playerId); err != nil {
		return nil, err
	} else if picker.Role != PlayerRole.Picker {
		return nil, fmt.Errorf("%s not the picker", picker.PlayerID)
	} else {
		picker.BuryCards(cards)
		result.BuriedCards = cards
		if h.Settings.CallingMethod == CallingMethod.Alone {
			h.Phase = HandPhase.Play
			h.StartNextTrick()
		} else {
			h.Phase = HandPhase.Call
		}
		return result, nil
	}
}

func (h *Hand) Call(playerId string, card *deck.Card) (*CallResult, error) {
	result := &CallResult{}
	if h.Phase != HandPhase.Call {
		return nil, fmt.Errorf("not in bury phase")
	} else if _, err := h.ValidateUpNext(playerId); err != nil {
		return nil, err
	} else {
		h.CalledCard = card
		result.CalledCard = card
		for _, player := range h.Players {
			if player.Role == PlayerRole.Picker {
				continue
			} else if player.HasCard(card) {
				result.CalledID = player.PlayerID
				player.SetRole(PlayerRole.Partner)
				h.PartnerID = player.PlayerID
			} else {
				player.SetRole(PlayerRole.Opponent)
			}
		}
		// Set the phase to play and start next trick
		h.Phase = HandPhase.Play
		h.StartNextTrick()
		return result, nil
	}
}

func (h *Hand) Play(playerId string, card *deck.Card) (*PlayCardResult, error) {
	result := &PlayCardResult{}
	if h.Phase != HandPhase.Play {
		return nil, fmt.Errorf("not in play phase")
	} else if trick := h.GetCurrentTrick(); trick == nil {
		return nil, fmt.Errorf("trick not started")
	} else if trick.IsComplete() {
		return nil, fmt.Errorf("trick already complete")
	} else if player, err := h.ValidateUpNext(playerId); err != nil {
		return nil, err
	} else if err := player.RemoveCard(card); err != nil {
		return nil, err
	} else if err := trick.PlayCard(card); err != nil {
		return nil, err
	} else {
		result.PlayedCard = card
		if trick.IsComplete() {
			// Summarize the completed trick
			result.TrickSummary = trick.SummarizeTrick()
			if h.IsComplete() {
				// Summarize the completed hand
				result.HandSummary = h.SummarizeHand()
				h.Phase = HandPhase.Done
			} else {
				// Start the next trick
				h.StartNextTrick()
			}
		}
		return result, nil
	}
}
