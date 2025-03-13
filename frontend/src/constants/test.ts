import { Trick } from "../types/game";
import { CARD_RANK, CARD_SUIT } from "./card"

// All trump cards, ordered by strength
export const TEST_TRUMP_CARDS = [
    { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.DIAMOND },
    { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.DIAMOND },
    { rank: CARD_RANK.NINE, suit: CARD_SUIT.DIAMOND },
    { rank: CARD_RANK.KING, suit: CARD_SUIT.DIAMOND },
    { rank: CARD_RANK.TEN, suit: CARD_SUIT.DIAMOND },
    { rank: CARD_RANK.ACE, suit: CARD_SUIT.DIAMOND },
    { rank: CARD_RANK.JACK, suit: CARD_SUIT.DIAMOND },
    { rank: CARD_RANK.JACK, suit: CARD_SUIT.HEART },
    { rank: CARD_RANK.JACK, suit: CARD_SUIT.SPADE },
    { rank: CARD_RANK.JACK, suit: CARD_SUIT.CLUB },
    { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.DIAMOND },
    { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.HEART },
    { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.SPADE },
    { rank: CARD_RANK.QUEEN, suit: CARD_SUIT.CLUB },
] as const;

// All non-trump cards, ordered by strength
export const TEST_FAIL_CARDS = [
    // Spade
    { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.SPADE },
    { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.SPADE },
    { rank: CARD_RANK.NINE, suit: CARD_SUIT.SPADE },
    { rank: CARD_RANK.KING, suit: CARD_SUIT.SPADE },
    { rank: CARD_RANK.TEN, suit: CARD_SUIT.SPADE },
    { rank: CARD_RANK.ACE, suit: CARD_SUIT.SPADE },
    // Heart
    { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.HEART },
    { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.HEART },
    { rank: CARD_RANK.NINE, suit: CARD_SUIT.HEART },
    { rank: CARD_RANK.KING, suit: CARD_SUIT.HEART },
    { rank: CARD_RANK.TEN, suit: CARD_SUIT.HEART },
    { rank: CARD_RANK.ACE, suit: CARD_SUIT.HEART },
    // Club
    { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.CLUB },
    { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.CLUB },
    { rank: CARD_RANK.NINE, suit: CARD_SUIT.CLUB },
    { rank: CARD_RANK.KING, suit: CARD_SUIT.CLUB },
    { rank: CARD_RANK.TEN, suit: CARD_SUIT.CLUB },
    { rank: CARD_RANK.ACE, suit: CARD_SUIT.CLUB },
] as const;

export const TEST_CARDS = [
    ...TEST_FAIL_CARDS,
    ...TEST_TRUMP_CARDS,
] as const;

export const TEST_COMPLETE_TRICK: Trick = {
    turnOrder: ['a', 'b', 'c', 'd', 'e'],
    cards: {
        a: { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.SPADE },
        b: { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.SPADE },
        c: { rank: CARD_RANK.NINE, suit: CARD_SUIT.SPADE },
        d: { rank: CARD_RANK.KING, suit: CARD_SUIT.SPADE },
        e: { rank: CARD_RANK.TEN, suit: CARD_SUIT.SPADE },
    },
} as const;

export const TEST_INCOMPLETE_TRICK: Trick = {
    turnOrder: ['a', 'b', 'c', 'd', 'e'],
    cards: {
        a: { rank: CARD_RANK.SEVEN, suit: CARD_SUIT.SPADE },
        b: { rank: CARD_RANK.EIGHT, suit: CARD_SUIT.SPADE },
        c: { rank: CARD_RANK.NINE, suit: CARD_SUIT.SPADE },
    },
} as const;