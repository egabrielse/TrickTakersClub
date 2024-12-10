package deck

func FilterForSuit(cards []*Card, suit string) (filtered []*Card) {
	filtered = []*Card{}
	for _, card := range cards {
		if card.Suit == suit && !card.IsTrump() {
			filtered = append(filtered, card)
		}
	}
	return filtered
}

func FilterForTrump(cards []*Card) (filtered []*Card) {
	filtered = []*Card{}
	for _, card := range cards {
		if card.IsTrump() {
			filtered = append(filtered, card)
		}
	}
	return filtered
}

func FilterForPlayableCards(cards []*Card, leadCard *Card) (filtered []*Card) {
	if leadCard.IsTrump() {
		filtered = FilterForTrump(cards)
	} else {
		filtered = FilterForSuit(cards, leadCard.Suit)
	}
	// leadCard is nil or all cards were filtered out
	if len(filtered) == 0 {
		filtered = cards
	}
	return filtered
}
