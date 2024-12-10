package deck

var CardSuit = struct {
	Spade   string
	Heart   string
	Diamond string
	Club    string
}{
	Spade:   "spade",
	Heart:   "heart",
	Diamond: "diamond",
	Club:    "club",
}

var CardSuits = []string{CardSuit.Spade, CardSuit.Heart, CardSuit.Diamond, CardSuit.Club}

var CardRank = struct {
	Seven string
	Eight string
	Nine  string
	King  string
	Ten   string
	Ace   string
	Jack  string
	Queen string
}{
	Seven: "seven",
	Eight: "eight",
	Nine:  "nine",
	King:  "king",
	Ten:   "ten",
	Ace:   "ace",
	Jack:  "jack",
	Queen: "queen",
}

var CardRanks = []string{CardRank.Seven, CardRank.Eight, CardRank.Nine, CardRank.King, CardRank.Ten, CardRank.Ace, CardRank.Jack, CardRank.Queen}
