package deck

type Card struct {
	Suit string `json:"suit"`
	Rank string `json:"rank"`
}

func NewCard(suit, rank string) *Card {
	return &Card{
		Suit: suit,
		Rank: rank,
	}
}

func (c *Card) IsTrump() (isTrump bool) {
	isDiamond := c.Suit == CardSuit.Diamond
	isJack := c.Rank == CardRank.Jack
	isQueen := c.Rank == CardRank.Queen
	return isDiamond || isJack || isQueen
}

func (c *Card) GetRankOrder() (rank int) {
	switch c.Rank {
	case CardRank.Seven:
		return 1
	case CardRank.Eight:
		return 2
	case CardRank.Nine:
		return 3
	case CardRank.King:
		return 4
	case CardRank.Ten:
		return 5
	case CardRank.Ace:
		return 6
	case CardRank.Jack:
		switch c.Suit {
		case CardSuit.Diamond:
			return 7
		case CardSuit.Heart:
			return 8
		case CardSuit.Spade:
			return 9
		case CardSuit.Club:
			return 10
		}
	case CardRank.Queen:
		switch c.Suit {
		case CardSuit.Diamond:
			return 11
		case CardSuit.Heart:
			return 12
		case CardSuit.Spade:
			return 13
		case CardSuit.Club:
			return 14
		}
	}
	return 0 // Should never reach here
}

func (c *Card) GetPoints() (points int) {
	switch c.Rank {
	case CardRank.Queen:
		return 3
	case CardRank.Jack:
		return 2
	case CardRank.Ace:
		return 11
	case CardRank.Ten:
		return 10
	case CardRank.King:
		return 4
	default:
		return 0
	}
}

func (c *Card) Compare(other *Card, leadingSuit string) (isGreater bool) {
	if c.IsTrump() && !other.IsTrump() {
		return true
	} else if !c.IsTrump() && other.IsTrump() {
		return false
	} else if c.IsTrump() && other.IsTrump() {
		return c.GetRankOrder() > other.GetRankOrder()
	} else if c.Suit == leadingSuit && other.Suit != leadingSuit {
		return true
	} else if c.Suit != leadingSuit && other.Suit == leadingSuit {
		return false
	} else {
		return c.GetRankOrder() > other.GetRankOrder()
	}
}
