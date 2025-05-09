package deck

import "main/utils"

func FilterForSuit(cards []*Card, suit string) (filtered []*Card) {
	if suit == CardSuit.Diamond {
		// Diamonds are trump, therefore filter for trump cards
		return FilterForTrump(cards)
	}
	return utils.Filter(cards, func(c *Card) bool { return c.Suit == suit && !c.IsTrump() })
}

func FilterAgainstSuit(cards []*Card, suit string) (filtered []*Card) {
	if suit == CardSuit.Diamond {
		// Diamonds are trump, therefore filter against trump cards
		return FilterAgainstTrump(cards)
	}
	return utils.Filter(cards, func(c *Card) bool { return c.Suit != suit || c.IsTrump() })
}

func FilterForTrump(cards []*Card) (filtered []*Card) {
	return utils.Filter(cards, func(c *Card) bool { return c.IsTrump() })
}

func FilterAgainstTrump(cards []*Card) (filtered []*Card) {
	return utils.Filter(cards, func(c *Card) bool { return !c.IsTrump() })
}

func FilterForCard(cards []*Card, card *Card) (filtered []*Card) {
	return utils.Filter(cards, func(c *Card) bool { return c == card })
}

func FilterAgainstCard(cards []*Card, card *Card) (filtered []*Card) {
	return utils.Filter(cards, func(c *Card) bool { return c != card })
}

func FilterByLeadingCard(hand []*Card, leadCard *Card) (filtered []*Card) {
	if leadCard == nil {
		return []*Card{}
	}
	if leadCard.IsTrump() {
		return FilterForTrump(hand)
	}
	return FilterForSuit(hand, leadCard.Suit)
}
