package hand

import (
	"fmt"
	"sheepshead/deck"
	"sheepshead/scoring"
	"sheepshead/utils"
)

type Hand struct {
	HandsPlayed int           `json:"handsPlayed"` // Number of hands played
	PlayerOrder []string      `json:"playerOrder"` // Order of players at the table starting with the dealer
	Phase       string        `json:"phase"`       // Phase of the hand
	PlayerHands *PlayerHands  `json:"playerHands"` // Players
	Blind       *Blind        `json:"blind"`       // Blind Phase
	Bury        *Bury         `json:"bury"`        // Bury Phase
	Call        *Call         `json:"call"`        // Call Phase
	Tricks      []*Trick      `json:"tricks"`      // Tricks played in the hand
	Settings    *GameSettings `json:"settings"`    // Game settings
}

func NewHand(playerOrder []string, settings *GameSettings) *Hand {
	// Turn order starts with the player to the left of the dealer
	leftOfDealer := playerOrder[1]
	turnOrder := utils.RelistStartingWith(playerOrder, leftOfDealer)
	deck := deck.NewDeck()
	playerHands := NewPlayerHands(turnOrder)
	for index := range turnOrder {
		playerID := turnOrder[index]
		playerHands.SetHand(playerID, deck.Draw(HandSize))
	}
	return &Hand{
		PlayerOrder: playerOrder,
		Phase:       HandPhase.Pick,
		PlayerHands: playerHands,
		Blind:       NewBlind(turnOrder, deck.Draw(BlindSize)),
		Bury:        NewBury(),
		Call:        NewCall(),
		Tricks:      []*Trick{NewTrick(turnOrder)},
		Settings:    settings,
	}
}

func (h *Hand) IsComplete() bool {
	return h.Phase == HandPhase.Done
}

func (h *Hand) GetCurrentTrick() *Trick {
	if len(h.Tricks) == 0 {
		return nil
	}
	return h.Tricks[len(h.Tricks)-1]
}

func (h *Hand) WhoIsNext() string {
	switch h.Phase {
	case HandPhase.Pick:
		return h.Blind.WhoIsNext()
	case HandPhase.Bury:
		return h.Blind.PickerID
	case HandPhase.Call:
		return h.Blind.PickerID
	case HandPhase.Play:
		currentTrick := h.GetCurrentTrick()
		if currentTrick == nil {
			return ""
		}
		return currentTrick.WhoIsNext()
	default:
		return ""
	}
}

func (h *Hand) Pick(playerID string) (*PickResult, error) {
	if h.Phase != HandPhase.Pick {
		return nil, fmt.Errorf("not in the pick phase")
	} else if playerID != h.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if h.Blind.IsComplete() {
		return nil, fmt.Errorf("picking phase is already complete")
	} else {
		// Take the blind
		blind := h.Blind.Pick()
		// Put the blind in the player's hand
		hand := h.PlayerHands.GetHand(playerID)
		h.PlayerHands.SetHand(playerID, append(hand, blind...))
		// Move to the bury phase
		h.Phase = HandPhase.Bury
		return &PickResult{
			PickerID: playerID,
			Blind:    blind,
		}, nil
	}
}

func (h *Hand) Pass(playerID string) (*PassResult, error) {
	if h.Phase != HandPhase.Pick {
		return nil, fmt.Errorf("not in the pick phase")
	} else if playerID != h.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if h.Blind.IsComplete() {
		return nil, fmt.Errorf("picking phase is already complete")
	} else {
		h.Blind.Pass()
		dealerID := h.PlayerOrder[0]
		if h.Settings.NoPickMethod == NoPickMethod.ScrewTheDealer && dealerID == h.WhoIsNext() {
			result, _ := h.Pick(dealerID)
			return &PassResult{PickResult: result}, nil
		} else if h.Blind.IsComplete() {
			// No player picked, move onto the play phase of leasters or mosters
			h.Phase = HandPhase.Play
			return &PassResult{AllPassed: true}, nil
		} else {
			return &PassResult{}, nil
		}
	}
}

func (h *Hand) BuryCards(playerID string, cards []*deck.Card) (*BuryResult, error) {
	if h.Phase != HandPhase.Bury {
		return nil, fmt.Errorf("not in the bury phase")
	} else if playerID != h.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if h.Bury.IsComplete() {
		return nil, fmt.Errorf("bury phase is already complete")
	} else if ok := h.PlayerHands.Contains(playerID, cards); !ok {
		return nil, fmt.Errorf("player does not possess all the cards")
	} else if len(cards) != BlindSize {
		return nil, fmt.Errorf("expected %d cards, got %d", BlindSize, len(cards))
	} else {
		// Remove the buried cards from the player's hand
		h.PlayerHands.RemoveCards(playerID, cards)
		// Put the cards in the bury
		h.Bury.BuryCards(cards)

		if h.Settings.CallMethod == CallMethod.CutThroat {
			// Picker does not get to choose a partner in cut throat
			h.Phase = HandPhase.Play
		} else if h.Settings.CallMethod == CallMethod.JackOfDiamonds {
			// Partner is automatically the player holding the jack of diamonds
			h.Phase = HandPhase.Call
			jacks := []*deck.Card{
				{Suit: deck.CardSuit.Diamond, Rank: deck.CardRank.Jack},
				{Suit: deck.CardSuit.Heart, Rank: deck.CardRank.Jack},
				{Suit: deck.CardSuit.Spade, Rank: deck.CardRank.Jack},
				{Suit: deck.CardSuit.Club, Rank: deck.CardRank.Jack},
			}
			for _, j := range jacks {
				if !h.PlayerHands.Contains(playerID, []*deck.Card{j}) && !h.Bury.Contains([]*deck.Card{j}) {
					// Found a jack that the player does not have in their hand or bury.
					// The player who has this jack is the partner.
					result, _ := h.CallPartner(playerID, j)
					return &BuryResult{
						Bury:       cards,
						CallResult: result,
					}, nil
				}
			}
			// Picker has all jacks, and therefore must go alone
			result, _ := h.GoAlone(playerID, true)
			return &BuryResult{
				Bury:          cards,
				GoAloneResult: result,
			}, nil
		} else {
			// Move onto the call phase
			h.Phase = HandPhase.Call
		}
		return &BuryResult{Bury: cards}, nil
	}
}

func (h *Hand) CallPartner(playerID string, card *deck.Card) (*CallResult, error) {
	if h.Phase != HandPhase.Call {
		return nil, fmt.Errorf("not in the call phase")
	} else if playerID != h.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if h.Call.IsComplete() {
		return nil, fmt.Errorf("call phase is already complete")
	} else if playerID == h.PlayerHands.WhoHas(card) {
		return nil, fmt.Errorf("player cannot call a card in their own hand")
	} else {
		// Find out who holds the picked card
		partnerID := h.PlayerHands.WhoHas(card)
		// Record the called card and partner
		h.Call.CallPartner(card, partnerID)
		h.Phase = HandPhase.Play
		return &CallResult{CalledCard: card}, nil
	}
}

func (h *Hand) GoAlone(playerID string, forced bool) (*GoAloneResult, error) {
	if h.Phase != HandPhase.Call {
		return nil, fmt.Errorf("not in the call phase")
	} else if playerID != h.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if h.Call.IsComplete() {
		return nil, fmt.Errorf("call phase is already complete")
	} else {
		h.Call.GoAlone()
		h.Phase = HandPhase.Play
		return &GoAloneResult{Forced: forced}, nil
	}
}

func (h *Hand) PlayCard(playerID string, card *deck.Card) (*PlayCardResult, error) {
	if h.Phase != HandPhase.Play {
		return nil, fmt.Errorf("not in the call phase")
	} else if playerID != h.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if !h.PlayerHands.Contains(playerID, []*deck.Card{card}) {
		return nil, fmt.Errorf("player does not possess the card")
	} else {
		result := &PlayCardResult{PlayedCard: card}
		// Remove the card from the player's hand and play it on the trick
		h.PlayerHands.RemoveCards(playerID, []*deck.Card{card})
		currentTrick := h.GetCurrentTrick()
		currentTrick.PlayCard(card)
		// Check if partner has been revealed
		result.PartnerID = h.Call.ConditionallyRevealPartner(card)
		// Check if the trick is complete
		if currentTrick.IsComplete() {
			result.TakerID = currentTrick.GetTakerID()
			result.TrickComplete = true
			// Trick is complete
			if len(h.Tricks) == HandSize {
				// Hand is complete
				h.Phase = HandPhase.Done
				result.HandComplete = true
			} else {
				// If the hand is not yet complete, start the next trick
				takerID := currentTrick.GetTakerID()
				newTrickOrder := utils.RelistStartingWith(h.PlayerOrder, takerID)
				newTrick := NewTrick(newTrickOrder)
				h.Tricks = append(h.Tricks, newTrick)
			}
		}
		return result, nil
	}
}

func (h *Hand) SummarizeHand() (*HandSummary, error) {
	if !h.IsComplete() {
		return nil, fmt.Errorf("hand is not complete")
	}
	sum := NewHandSummary(h.PlayerOrder)
	sum.Tricks = h.Tricks
	// Count up the points won from tricks and the number of tricks each player won
	pointsWon := map[string]int{}
	tricksWon := map[string]int{}
	for index := range h.PlayerOrder {
		playerID := h.PlayerOrder[index]
		pointsWon[playerID] = 0
		tricksWon[playerID] = 0
	}
	for _, trick := range h.Tricks {
		takerID := trick.GetTakerID()
		tricksWon[takerID] += 1
		pointsWon[takerID] += trick.CountPoints()
	}

	// Calculate the hand summary
	var payouts map[string]int
	if h.Blind.IsNoPickHand() {
		// Count up the points in the blind and add to the taker of the last trick
		lastTakerID := h.Tricks[len(h.Tricks)-1].GetTakerID()
		sum.Blind = h.Blind.Cards
		blindPoints := deck.CountPoints(h.Blind.Cards)
		pointsWon[lastTakerID] += blindPoints
		if h.Settings.NoPickMethod == NoPickMethod.Leasters {
			// Leasters Hand (No Picker)
			payouts, sum.Winners = scoring.ScoreLeastersHand(pointsWon, tricksWon)
			sum.ScoringMethod = "leasters"
		} else if h.Settings.NoPickMethod == NoPickMethod.Mosters {
			// Mosters Hand (No Picker)
			payouts, sum.Winners = scoring.ScoreMostersHand(pointsWon)
			sum.ScoringMethod = "mosters"
		} else {
			return nil, fmt.Errorf("unhandled no pick method")
		}
	} else {
		// Someone picked, score hand normally
		sum.ScoringMethod = "standard"
		sum.PickerID = h.Blind.PickerID
		sum.PartnerID = h.Call.PartnerID
		sum.OpponentIDs = utils.Filter(h.PlayerOrder, func(id string) bool {
			return id != sum.PickerID && id != sum.PartnerID
		})
		// Count up the points in the bury and add to the picker's points
		sum.Bury = h.Bury.Cards
		buriedPoints := deck.CountPoints(h.Bury.Cards)
		pointsWon[sum.PickerID] += buriedPoints
		payouts, sum.Winners, sum.PayoutMultipliers = scoring.ScoreHand(
			sum.PickerID,
			sum.PartnerID,
			pointsWon,
			tricksWon,
			h.Settings.DoubleOnTheBump,
		)
	}
	sum.Payouts = payouts
	sum.PointsWon = pointsWon
	sum.TricksWon = tricksWon

	return sum, nil
}
