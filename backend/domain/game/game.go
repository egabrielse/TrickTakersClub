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
	Play          *hand.Play    `json:"play"`          // Play Phase
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
		blindSize := g.Settings.GetBlindSize()
		players := NewPlayers(turnOrder)
		g.Blind = hand.NewBlind(turnOrder, deck.Draw(blindSize))
		for index := range g.PlayerOrder {
			playerID := turnOrder[index]
			players.SetHand(playerID, deck.Draw(g.Settings.HandSize))
		}
		g.Bury = hand.NewBury()
		g.Call = hand.NewCall()
		g.Play = hand.NewPlay(turnOrder, g.Settings.HandSize)
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
		return g.Play.WhoIsNext()
	default:
		return ""
	}
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
	} else if len(cards) != g.Settings.GetBlindSize() {
		return nil, fmt.Errorf("expected %d cards, got %d", g.Settings.GetBlindSize(), len(cards))
	} else {
		// Remove the cards from the player's hand
		for index := range cards {
			g.Players.RemoveCard(playerID, cards[index])
		}
		// Put the cards in the bury
		g.Bury.BuryCards(cards)
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
		return &CallResult{PartnerID: partnerID, CalledCard: card}, nil
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
		return &GoAloneResult{}, nil
	}
}

func (g *Game) PlayCard(playerID string, card *deck.Card) (*PlayCardResult, error) {
	if g.Phase != HandPhase.Play {
		return nil, fmt.Errorf("not in the call phase")
	} else if playerID != g.WhoIsNext() {
		return nil, fmt.Errorf("not player's turn")
	} else if g.Play.IsComplete() {
		return nil, fmt.Errorf("call play is already complete")
	} else if !g.Players.HandContains(playerID, []*deck.Card{card}) {
		return nil, fmt.Errorf("player does not possess the card")
	} else {
		result := &PlayCardResult{PlayedCard: card}
		// Play the card in the trick
		trickSummary := g.Play.PlayCard(card)
		// Check if partner has been revealed
		if *card == *g.Call.GetCalledCard() {
			g.Call.Reveal()
			result.PartnerID = g.Call.GetPartnerID()
		}
		// Check if the trick is complete
		if trickSummary != nil {
			// Trick is complete
			result.TrickSummary = trickSummary
			if g.Play.IsComplete() {
				// Hand is complete
				result.HandSummary = g.SummarizeHand()
				// Update the scoreboard
				for playerID, summary := range result.HandSummary.PlayerSummaries {
					g.Scoreboard.UpdateScore(playerID, summary.Score, summary.Points, summary.Tricks)
				}
				// Move onto the done phase
				g.Phase = HandPhase.Score
				if g.Settings.AutoDeal {
					// Automatically start the next hand
					g.StartNewHand()
				}
			}
		}
		return result, nil
	}
}

func (g *Game) SummarizeHand() *summary.HandSummary {
	sum := summary.NewHandSummary(g.PlayerOrder)
	// Summarize the tricks
	trickSummaries := g.Play.SummarizeTricks()
	sum.TrickSummaries = trickSummaries

	// Count up the points won from tricks and the number of tricks each player won
	points := map[string]int{}
	tricks := map[string]int{}
	for index := range g.PlayerOrder {
		playerID := g.PlayerOrder[index]
		points[playerID] = 0
		tricks[playerID] = 0
	}
	for index := range trickSummaries {
		trickSum := trickSummaries[index]
		tricks[trickSum.TakerID] += 1
		points[trickSum.TakerID] += trickSum.Points
	}

	// Calculate the hand summary
	var scores map[string]int
	switch g.ScoringMethod {
	case NoPickResolution.Leasters:
		// Leasters Hand (No Picker)
		scores, sum.Winners = scoring.ScoreLeastersHand(points, tricks)
	case NoPickResolution.Mosters:
		// Mosters Hand (No Picker)
		scores, sum.Winners = scoring.ScoreMostersHand(points)
	default:
		// Someone picked, score hand normally
		pickerID := g.Blind.PickerID
		partnerID := g.Call.GetPartnerID()
		sum.PickerID = pickerID
		buriedPoints := deck.CountPoints(g.Bury.Cards)
		// Count up the points in the bury and add to the picker's points
		points[pickerID] += buriedPoints
		sum.BurySummary = summary.BurySummary{Cards: g.Bury.Cards, Points: buriedPoints}
		scores, sum.Winners = scoring.ScoreHand(pickerID, partnerID, points, tricks, g.Settings.DoubleOnTheBump)
	}
	// Update the player summaries
	for playerID, score := range scores {
		sum.PlayerSummaries[playerID] = &summary.PlayerSummary{
			Score:  score,
			Points: points[playerID],
			Tricks: tricks[playerID],
		}
	}
	return sum
}
