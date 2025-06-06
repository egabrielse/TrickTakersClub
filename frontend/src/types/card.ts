import { CARD_RANK, CARD_SUIT } from "../constants/card";

export type CardRank = typeof CARD_RANK[keyof typeof CARD_RANK];
export type CardSuit = typeof CARD_SUIT[keyof typeof CARD_SUIT];
export type FailSuit = typeof CARD_SUIT.SPADE | typeof CARD_SUIT.HEART | typeof CARD_SUIT.CLUB;

export type Card = {
    suit: CardSuit;
    rank: CardRank;
}
