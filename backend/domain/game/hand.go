package game

import (
	"fmt"
	"main/domain/game/deck"
	"main/domain/game/scoring"
	"main/utils"
)

type Hand struct {
	Blind       []*deck.Card       `json:"blind"`       // Blind cards
	CalledCard  *deck.Card         `json:"calledCard"`  // Card called by the picker
	HandOrder   []string           `json:"handOrder"`   // Order of players starting with the dealer
	PartnerID   string             `json:"partnerId"`   // Partner of the picker
	Phase       string             `json:"phase"`       // Phase of the hand
	PickIndex   int                `json:"PickIndex"`   // Index of the player who's turn it is to pick or pass
	PickerID    string             `json:"pickerId"`    // Player who picked the blind
	Players     map[string]*Player `json:"players"`     // Player hands
	Settings    *GameSettings      `json:"settings"`    // Game settings
	TotalTricks int                `json:"totalTricks"` // Total number of tricks in the hand
	Tricks      []*Trick           `json:"tricks"`      // Tricks played in the hand
	NoPick      bool               `json:"noPick"`      // True if no-pick scenario has occurred (doublers, leasters, mosters)
	Doubled     int                `json:"doubled"`     // Number of times the hand has been doubled (for doubler no-pick resolution)
}

func NewHand(settings *GameSettings, handOrder []string, doubled int) (hand *Hand) {
	handSize, blindSize := settings.DeriveHandBlindSize()
	deck := deck.NewDeck()
	players := map[string]*Player{}
	for _, playerID := range handOrder {
		hand := deck.Draw(handSize)
		players[playerID] = NewPlayer(playerID, hand)
	}
	return &Hand{
		Blind:       deck.Draw(blindSize),
		Phase:       HandPhase.Pick,
		Players:     players,
		PickIndex:   1, // Picking starts with the player to the left of the dealer (index 1)
		HandOrder:   handOrder,
		TotalTricks: handSize,
		Tricks:      []*Trick{},
		Settings:    settings,
		NoPick:      false,
		Doubled:     doubled,
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

func (h *Hand) PickOrPass(playerId string, pick bool) error {
	if h.Phase != HandPhase.Pick {
		return fmt.Errorf("not in pick phase")
	} else if player, err := h.ValidateUpNext(playerId); err != nil {
		return err
	} else if pick {
		player.TakeCards(h.Blind)
		player.SetRole(PlayerRole.Picker)
		h.PickerID = player.PlayerID
		h.Blind = []*deck.Card{}
		h.Phase = HandPhase.Bury
	} else if h.PickIndex == 0 {
		if h.Settings.NoPickResolution == NoPickResolution.Doublers {
			// Hand is restarted with the stakes doubled
			h = NewHand(h.Settings, h.HandOrder, h.Doubled+1)
		} else {
			// Play the hand with no picker (leasters or mosters)
			h.NoPick = true
		}
	} else if h.PickIndex == len(h.HandOrder)-1 && h.Settings.NoPickResolution == NoPickResolution.ScrewTheDealer {
		// Everyone but dealer has passed, dealer must pick. Move to the bury phase.
		h.Phase = HandPhase.Bury
	} else {
		// Move to the next person
		h.PickIndex = (h.PickIndex + 1) % len(h.HandOrder)
	}
	return nil
}

func (h *Hand) Bury(playerId string, cards []*deck.Card) error {
	if h.Phase != HandPhase.Bury {
		return fmt.Errorf("not in bury phase")
	} else if picker, err := h.ValidateUpNext(playerId); err != nil {
		return err
	} else if picker.Role != PlayerRole.Picker {
		return fmt.Errorf("%s not the picker", picker.PlayerID)
	} else {
		picker.BuryCards(cards)
		h.Phase = HandPhase.Call
		return nil
	}
}

func (h *Hand) Call(playerId string, card *deck.Card) error {
	if h.Phase != HandPhase.Call {
		return fmt.Errorf("not in bury phase")
	} else if _, err := h.ValidateUpNext(playerId); err != nil {
		return err
	} else {
		h.CalledCard = card
		for _, player := range h.Players {
			if player.Role == PlayerRole.Picker {
				continue
			} else if player.HasCard(card) {
				player.SetRole(PlayerRole.Partner)
				h.PartnerID = player.PlayerID
			} else {
				player.SetRole(PlayerRole.Opponent)
			}
		}
		// Set the phase to play and start next trick
		// TODO: Handle cracking and blitzing
		h.Phase = HandPhase.Play
		h.StartNextTrick()
		return nil
	}
}

func (h *Hand) Play(playerId string, card *deck.Card) error {
	if h.Phase != HandPhase.Play {
		return fmt.Errorf("not in play phase")
	} else if trick := h.GetCurrentTrick(); trick == nil {
		return fmt.Errorf("trick not started")
	} else if trick.IsComplete() {
		return fmt.Errorf("trick already complete")
	} else if player, err := h.ValidateUpNext(playerId); err != nil {
		return err
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
		takerID := trick.GetTakerID()
		tricks[takerID] += 1
		points[takerID] += deck.CountPoints(trick.Cards)
		sum.TrickSums = append(sum.TrickSums, TrickSummary{
			TakerID: takerID,
			Cards:   trick.Cards,
			Points:  points[takerID],
		})
	}

	if h.PickerID == "" && h.Settings.NoPickResolution == NoPickResolution.Leasters {
		// Leasters Hand (No Picker)
		sum.PointsWon = points
		sum.TricksWon = tricks
		sum.Scores, sum.Winners = scoring.ScoreLeastersHand(points, tricks)
	} else if h.PickerID == "" && h.Settings.NoPickResolution == NoPickResolution.Mosters {
		// Mosters Hand (No Picker)
		sum.PointsWon = points
		sum.TricksWon = tricks
		sum.Scores, sum.Winners = scoring.ScoreMostersHand(points)
	} else {
		// Normal Hand (Someone picked)
		sum.PickerID = h.PickerID
		player := h.Players[h.PickerID]

		// Count up the points in the bury and add to the picker's points
		points[h.PickerID] += deck.CountPoints(player.Bury)
		sum.BurySummary = BurySummary{
			Cards:  player.Bury,
			Points: points[h.PickerID],
		}

		sum.PointsWon = points
		sum.TricksWon = tricks
		sum.Scores, sum.Winners = scoring.ScoreHand(h.PickerID, h.PartnerID, points, tricks, h.Settings.DoubleOnTheBump)
	}
	return sum
}
