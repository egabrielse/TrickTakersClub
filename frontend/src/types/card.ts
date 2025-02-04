import { CARD_RANK, CARD_SIZE, CARD_SUIT } from "../constants/card";

export type CardSize = typeof CARD_SIZE[keyof typeof CARD_SIZE];

export type CardRank = typeof CARD_RANK[keyof typeof CARD_RANK];
export type CardSuit = typeof CARD_SUIT[keyof typeof CARD_SUIT];


export type PlayingCard = {
    suit: CardSuit;
    rank: CardRank;
}
