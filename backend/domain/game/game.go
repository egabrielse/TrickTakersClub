package game

import (
	"fmt"
	"main/domain/game/deck"
	"main/domain/game/hand"
	"main/domain/game/scoring"
	"main/domain/game/summary"
	"main/utils"
)

type Game struct {
	DealerIndex   int           `json:"dealerIndex"`   // Index of the dealer in the Players array
	Scoreboard    Scoreboard    `json:"scoreboard"`    // Scoreboard
	HandsPlayed   int           `json:"handsPlayed"`   // Number of hands played
	PlayerOrder   []string      `json:"playerOrder"`   // Order of players at the table
	Settings      *GameSettings `json:"settings"`      // Game settings
	Players       *Players      `json:"players"`       // Players
	Phase         string        `json:"phase"`         // Phase of the hand
	Blind         *hand.Blind   `json:"blind"`         // Blind Phase
	Bury          *hand.Bury    `json:"bury"`          // Bury Phase
	Call          *hand.Call    `json:"call"`          // Call Phase
	Tricks        []*hand.Trick `json:"tricks"`        // Play Phase - tricks in the hand
	ScoringMethod string        `json:"scoringMethod"` // Method to use for scoring the hand
}

func NewGame(players []string, settings *GameSettings) *Game {
	return &Game{
		DealerIndex: -1,
		HandsPlayed: 0,
		Scoreboard:  NewScoreboard(players),
		PlayerOrder: players,
		Settings:    settings,
		Phase:       HandPhase.Setup,
	}
}

func (g *Game) StartNewHand() error {
	if g.Phase != HandPhase.Setup && g.Phase != HandPhase.Score {
		return fmt.Errorf("hand in progress")
	} else {
		g.Phase = HandPhase.Pick
		g.DealerIndex = (g.DealerIndex + 1) % len(g.PlayerOrder)
		// Turn order starts with the player to the left of the dealer
		leftOfDealer := g.PlayerOrder[(g.DealerIndex+1)%len(g.PlayerOrder)]
		turnOrder := utils.RelistStartingWith(g.PlayerOrder, leftOfDealer)
		deck := deck.NewDeck()
		players := NewPlayers(turnOrder)
		for index := range g.PlayerOrder {
			playerID := turnOrder[index]
			players.SetHand(playerID, deck.Draw(HandSize))
		}
		g.Players = players
		g.Blind = hand.NewBlind(turnOrder, deck.Draw(BlindSize))
		g.Bury = hand.NewBury()
		g.Call = hand.NewCall()
		g.Tricks = []*hand.Trick{hand.NewTrick(turnOrder)}
		g.ScoringMethod = ScoringMethod.Default
		return nil
	}
}

func (g *Game) HandInProgress() bool {
	return g.Phase != HandPhase.Setup && g.Phase != HandPhase.Score
}

func (g *Game) WhoIsDealer() string {
	return g.PlayerOrder[g.DealerIndex]
}

func (g *Game) WhoIsNext() string {
	switch g.Phase {
	case HandPhase.Pick:
		return g.Blind.WhoIsNext()
	case HandPhase.Bury:
		return g.Blind.PickerID
	case HandPhase.Call:
		return g.Blind.PickerID
	case HandPhase.Play:
		currentTrick := g.GetCurrentTrick()
		if currentTrick == nil {
			return ""
		}
		return currentTrick.WhoIsNext()
	default:
		return ""
	}
}

func (g *Game) GetCurrentTrick() *hand.Trick {
	if len(g.Tricks) == 0 {
		return nil
	}
	return g.Tricks[len(g.Tricks)-1]
}

func (g *Game) Pick(playerID string) (*PickOrPassResult, error) {
	if g.Phase != HandPhase.Pick {
		return nil, fmt.Errorf("not in the pick phase")
	} else if playerID != g.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if g.Blind.IsComplete() {
		return nil, fmt.Errorf("picking phase is already complete")
	} else {
		// Take the blind
		blind := g.Blind.Pick()
		// Put the blind in the player's hand
		hand := g.Players.GetHand(playerID)
		g.Players.SetHand(playerID, append(hand, blind...))
		// Move to the bury phase
		g.Phase = HandPhase.Bury
		return &PickOrPassResult{
			PickerID: playerID,
			Blind:    blind,
		}, nil
	}
}

func (g *Game) Pass(playerID string) (*PickOrPassResult, error) {
	if g.Phase != HandPhase.Pick {
		return nil, fmt.Errorf("not in the pick phase")
	} else if playerID != g.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if g.Blind.IsComplete() {
		return nil, fmt.Errorf("picking phase is already complete")
	} else {
		g.Blind.Pass()
		dealerID := g.PlayerOrder[g.DealerIndex]
		if dealerID == g.WhoIsNext() && g.Settings.NoPickResolution == NoPickResolution.ScrewTheDealer {
			return g.Pick(dealerID)
		}
		return nil, nil
	}
}

func (g *Game) BuryCards(playerID string, cards []*deck.Card) (*BuryResult, error) {
	if g.Phase != HandPhase.Bury {
		return nil, fmt.Errorf("not in the bury phase")
	} else if playerID != g.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if g.Bury.IsComplete() {
		return nil, fmt.Errorf("bury phase is already complete")
	} else if ok := g.Players.HandContains(playerID, cards); !ok {
		return nil, fmt.Errorf("player does not possess all the cards")
	} else if len(cards) != BlindSize {
		return nil, fmt.Errorf("expected %d cards, got %d", BlindSize, len(cards))
	} else {
		// Remove the buried cards from the player's hand
		g.Players.RemoveCards(playerID, cards)
		// Put the cards in the bury
		g.Bury.BuryCards(cards)
		// Move onto the call phase
		g.Phase = HandPhase.Call

		if g.Settings.CallingMethod == CallingMethod.CutThroat {
			// Picker does not get to choose a partner in cut throat
			g.Phase = HandPhase.Play
		} else if g.Settings.CallingMethod == CallingMethod.JackOfDiamonds {
			// Partner is automatically the player holding the jack of diamonds
			g.Phase = HandPhase.Call
			jod := &deck.Card{Suit: deck.CardSuit.Diamond, Rank: deck.CardRank.Jack}
			if partnerID := g.Players.WhoHas(jod); partnerID == playerID {
				// Picker has the jack of diamonds and must therefore go alone
				g.GoAlone(playerID)
				return &BuryResult{
					Bury:      cards,
					GoneAlone: true,
				}, nil
			} else {
				result, _ := g.CallPartner(playerID, jod)
				return &BuryResult{
					Bury:       cards,
					CallResult: result,
				}, nil
			}
		} else {
			// Move onto the call phase
			g.Phase = HandPhase.Call
		}
		return &BuryResult{
			Bury: cards,
		}, nil
	}
}

func (g *Game) CallPartner(playerID string, card *deck.Card) (*CallResult, error) {
	if g.Phase != HandPhase.Call {
		return nil, fmt.Errorf("not in the call phase")
	} else if playerID != g.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if g.Call.IsComplete() {
		return nil, fmt.Errorf("call phase is already complete")
	} else if playerID == g.Players.WhoHas(card) {
		return nil, fmt.Errorf("player cannot call a card in their own hand")
	} else {
		// Find out who holds the picked card
		partnerID := g.Players.WhoHas(card)
		// Record the called card and partner
		g.Call.CallPartner(card, partnerID)
		g.Phase = HandPhase.Play
		return &CallResult{CalledCard: card}, nil
	}
}

func (g *Game) GoAlone(playerID string) (*GoAloneResult, error) {
	if g.Phase != HandPhase.Call {
		return nil, fmt.Errorf("not in the call phase")
	} else if playerID != g.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if g.Call.IsComplete() {
		return nil, fmt.Errorf("call phase is already complete")
	} else {
		g.Call.GoAlone()
		g.Phase = HandPhase.Play
		return &GoAloneResult{}, nil
	}
}

func (g *Game) PlayCard(playerID string, card *deck.Card) (*PlayCardResult, error) {
	if g.Phase != HandPhase.Play {
		return nil, fmt.Errorf("not in the call phase")
	} else if playerID != g.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if !g.Players.HandContains(playerID, []*deck.Card{card}) {
		return nil, fmt.Errorf("player does not possess the card")
	} else {
		result := &PlayCardResult{PlayedCard: card}
		// Remove the card from the player's hand and play it on the trick
		g.Players.RemoveCards(playerID, []*deck.Card{card})
		currentTrick := g.GetCurrentTrick()
		currentTrick.PlayCard(card)
		// Check if partner has been revealed
		result.PartnerID = g.Call.ConditionallyRevealPartner(card)
		// Check if the trick is complete
		if currentTrick.IsComplete() {
			// Trick is complete
			if len(g.Tricks) == HandSize {
				// Hand is complete
				result.HandSummary = g.SummarizeHand()
				// Update the scoreboard
				for _, playerID := range g.PlayerOrder {
					score := result.HandSummary.Scores[playerID]
					points := result.HandSummary.PointsWon[playerID]
					tricks := result.HandSummary.TricksWon[playerID]
					g.Scoreboard.UpdateScore(playerID, score, points, tricks)
				}
				// Move onto the done phase
				g.Phase = HandPhase.Score
				g.StartNewHand()
			} else {
				// If the hand is not yet complete, start the next trick
				takerID := currentTrick.GetTakerID()
				newTrickOrder := utils.RelistStartingWith(g.PlayerOrder, takerID)
				newTrick := hand.NewTrick(newTrickOrder)
				g.Tricks = append(g.Tricks, newTrick)
			}
		}
		return result, nil
	}
}

func (g *Game) SummarizeHand() *summary.HandSummary {
	sum := summary.NewHandSummary(g.PlayerOrder)
	// Count up the points won from tricks and the number of tricks each player won
	pointsWon := map[string]int{}
	tricksWon := map[string]int{}
	for index := range g.PlayerOrder {
		playerID := g.PlayerOrder[index]
		pointsWon[playerID] = 0
		tricksWon[playerID] = 0
	}
	for _, trick := range g.Tricks {
		takerID := trick.GetTakerID()
		tricksWon[takerID] += 1
		pointsWon[takerID] += trick.CountPoints()
	}

	// Calculate the hand summary
	var scores map[string]int
	switch g.ScoringMethod {
	case NoPickResolution.Leasters:
		// Leasters Hand (No Picker)
		scores, sum.Winners = scoring.ScoreLeastersHand(pointsWon, tricksWon)
	case NoPickResolution.Mosters:
		// Mosters Hand (No Picker)
		scores, sum.Winners = scoring.ScoreMostersHand(pointsWon)
	default:
		// Someone picked, score hand normally
		sum.PickerID = g.Blind.PickerID
		sum.PartnerID = g.Call.PartnerID
		sum.OpponentIDs = utils.Filter(g.PlayerOrder, func(id string) bool {
			return id != sum.PickerID && id != sum.PartnerID
		})
		// Count up the points in the bury and add to the picker's points
		sum.Bury = g.Bury.Cards
		buriedPoints := deck.CountPoints(g.Bury.Cards)
		pointsWon[sum.PickerID] += buriedPoints
		scores, sum.Winners = scoring.ScoreHand(
			sum.PickerID,
			sum.PartnerID,
			pointsWon,
			tricksWon,
			g.Settings.DoubleOnTheBump,
		)
		if utils.Contains(sum.Winners, sum.PickerID) {
			sum.WinningTeam = "picking"
		} else {
			sum.WinningTeam = "opponents"
		}
	}
	sum.Scores = scores
	sum.PointsWon = pointsWon
	sum.TricksWon = tricksWon

	return sum
}
