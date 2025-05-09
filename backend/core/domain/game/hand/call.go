package hand

import "main/domain/game/deck"

type Call struct {
	Alone      bool       `json:"alone"`
	CalledCard *deck.Card `json:"calledCard"`
	PartnerID  string     `json:"partnerId"`
	Revealed   bool       `json:"revealed"`
}

func NewCall() *Call {
	return &Call{
		Alone:      false,
		CalledCard: nil,
		PartnerID:  "",
	}
}

func (c *Call) IsComplete() (isComplete bool) {
	return c.Alone || c.CalledCard != nil
}

func (c *Call) GoAlone() {
	c.Alone = true
}

func (c *Call) CallPartner(card *deck.Card, partnerID string) {
	c.CalledCard = card
	c.PartnerID = partnerID
}

func (c *Call) GetCalledCard() (card *deck.Card) {
	return c.CalledCard
}

func (c *Call) GetPartnerIfRevealed() (partnerID string) {
	if c.Revealed {
		return c.PartnerID
	}
	return ""
}

func (c *Call) ConditionallyRevealPartner(card *deck.Card) (partnerID string) {
	if c.CalledCard != nil && *c.CalledCard == *card {
		c.Revealed = true
		return c.PartnerID
	}
	return ""
}
