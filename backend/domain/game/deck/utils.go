package deck

// OrderCards sorts the cards in ascending order
func OrderCards(cards []*Card) {
	for i := 0; i < len(cards); i++ {
		for j := i + 1; j < len(cards); j++ {
			if cards[i].Rank > cards[j].Rank {
				cards[i], cards[j] = cards[j], cards[i]
			}
		}
	}
}

func CountPoints(cards []*Card) (points int) {
	for _, card := range cards {
		points += card.GetPoints()
	}
	return points
}
