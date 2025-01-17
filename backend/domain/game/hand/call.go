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

func (c *Call) GetPartnerID() (partnerID string) {
	return c.PartnerID
}

func (c *Call) Reveal() {
	c.Revealed = true
}

func (c *Call) GetPartnerIfRevealed() (partnerID string) {
	if c.Revealed {
		return c.PartnerID
	}
	return ""
}
