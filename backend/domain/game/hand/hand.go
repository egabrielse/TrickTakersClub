package hand

import (
	"fmt"
	"main/domain/game/deck"
	"main/domain/game/game_settings"
	"main/domain/game/scoring"
	"main/utils"
)

type Hand struct {
	HandsPlayed int                         `json:"handsPlayed"` // Number of hands played
	PlayerOrder []string                    `json:"playerOrder"` // Order of players at the table starting with the dealer
	Phase       string                      `json:"phase"`       // Phase of the hand
	PlayerHands *PlayerHands                `json:"playerHands"` // Players
	Blind       *Blind                      `json:"blind"`       // Blind Phase
	Bury        *Bury                       `json:"bury"`        // Bury Phase
	Call        *Call                       `json:"call"`        // Call Phase
	Tricks      []*Trick                    `json:"tricks"`      // Tricks played in the hand
	Settings    *game_settings.GameSettings `json:"settings"`    // Game settings
}

func NewHand(playerOrder []string, settings *game_settings.GameSettings) *Hand {
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
		if dealerID == h.WhoIsNext() && h.Settings.NoPickMethod == game_settings.NoPickMethod.ScrewTheDealer {
			result, _ := h.Pick(dealerID)
			return &PassResult{PickResult: result}, nil
		}
		return &PassResult{}, nil
	}
}

func (h *Hand) BuryCards(playerID string, cards []*deck.Card) (*BuryResult, error) {
	if h.Phase != HandPhase.Bury {
		return nil, fmt.Errorf("not in the bury phase")
	} else if playerID != h.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if h.Bury.IsComplete() {
		return nil, fmt.Errorf("bury phase is already complete")
	} else if ok := h.PlayerHands.HandContains(playerID, cards); !ok {
		return nil, fmt.Errorf("player does not possess all the cards")
	} else if len(cards) != BlindSize {
		return nil, fmt.Errorf("expected %d cards, got %d", BlindSize, len(cards))
	} else {
		// Remove the buried cards from the player's hand
		h.PlayerHands.RemoveCards(playerID, cards)
		// Put the cards in the bury
		h.Bury.BuryCards(cards)

		if h.Settings.CallMethod == game_settings.CallMethod.CutThroat {
			// Picker does not get to choose a partner in cut throat
			h.Phase = HandPhase.Play
		} else if h.Settings.CallMethod == game_settings.CallMethod.JackOfDiamonds {
			// Partner is automatically the player holding the jack of diamonds
			h.Phase = HandPhase.Call
			jod := &deck.Card{Suit: deck.CardSuit.Diamond, Rank: deck.CardRank.Jack}
			if partnerID := h.PlayerHands.WhoHas(jod); partnerID == playerID {
				// Picker has the jack of diamonds and must therefore go alone
				result, _ := h.GoAlone(playerID, true)
				return &BuryResult{
					Bury:          cards,
					GoAloneResult: result,
				}, nil
			} else {
				result, _ := h.CallPartner(playerID, jod)
				return &BuryResult{
					Bury:       cards,
					CallResult: result,
				}, nil
			}
		} else {
			// Move onto the call phase
			h.Phase = HandPhase.Call
		}
		return &BuryResult{
			Bury: cards,
		}, nil
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
	} else if !h.PlayerHands.HandContains(playerID, []*deck.Card{card}) {
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
	var scores map[string]int
	if h.Blind.PickerID == "" {
		if h.Settings.NoPickMethod == game_settings.NoPickMethod.Leasters {
			// Leasters Hand (No Picker)
			scores, sum.Winners = scoring.ScoreLeastersHand(pointsWon, tricksWon)
		} else if h.Settings.NoPickMethod == game_settings.NoPickMethod.Mosters {
			// Mosters Hand (No Picker)
			scores, sum.Winners = scoring.ScoreMostersHand(pointsWon)
		} else {
			return nil, fmt.Errorf("unhandled no pick method")
		}
	} else { // Someone picked, score hand normally
		sum.PickerID = h.Blind.PickerID
		sum.PartnerID = h.Call.PartnerID
		sum.OpponentIDs = utils.Filter(h.PlayerOrder, func(id string) bool {
			return id != sum.PickerID && id != sum.PartnerID
		})
		// Count up the points in the bury and add to the picker's points
		sum.Bury = h.Bury.Cards
		buriedPoints := deck.CountPoints(h.Bury.Cards)
		pointsWon[sum.PickerID] += buriedPoints
		scores, sum.Winners = scoring.ScoreHand(
			sum.PickerID,
			sum.PartnerID,
			pointsWon,
			tricksWon,
			h.Settings.DoubleOnTheBump,
		)
	}
	sum.Scores = scores
	sum.PointsWon = pointsWon
	sum.TricksWon = tricksWon

	return sum, nil
}
