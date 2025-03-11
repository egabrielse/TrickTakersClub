import { capitalize } from "@mui/material";
import { CARD_RANK, CARD_SUIT } from "../constants/card";
import { CardSuit, Card } from "../types/card";

/**
 * Return the path to the face of the playing card.
 */
export const getCardFace = (card: Card) => {
    return `/cards/${card.rank}-${card.suit}.svg`;
};

/**
 * Returns the path to the back of the playing card.
 */
export const getCardBack = (variant: number = 1) => {
    return `/cards/back-${variant}.svg`;
};

/**
 * Determines if a given card is of the trump suit.
 * @param card to evaluate
 * @returns true if trump, false otherwise
 */
export const isTrumpCard = (card: Card) => {
    return (
        card.suit === CARD_SUIT.DIAMOND ||
        card.rank === CARD_RANK.JACK ||
        card.rank === CARD_RANK.QUEEN
    );
};

/**
 * Get the cardinal rank of a playing card
 * @param card to evaluate
 * @returns number between 1 and 14 representing the card's rank
 */
export const getCardinalRank = (card: Card) => {
    switch (card.rank) {
        case CARD_RANK.SEVEN:
            return 1;
        case CARD_RANK.EIGHT:
            return 2;
        case CARD_RANK.NINE:
            return 3;
        case CARD_RANK.KING:
            return 4;
        case CARD_RANK.TEN:
            return 5;
        case CARD_RANK.ACE:
            return 6;
        case CARD_RANK.JACK: {
            switch (card.suit) {
                case CARD_SUIT.DIAMOND:
                    return 7;
                case CARD_SUIT.HEART:
                    return 8;
                case CARD_SUIT.SPADE:
                    return 9;
                case CARD_SUIT.CLUB:
                    return 10;
                default:
                    return 0;
            }
        }
        case CARD_RANK.QUEEN: {
            switch (card.suit) {
                case CARD_SUIT.DIAMOND:
                    return 11;
                case CARD_SUIT.HEART:
                    return 12;
                case CARD_SUIT.SPADE:
                    return 13;
                case CARD_SUIT.CLUB:
                    return 14;
                default:
                    return 0;
            }
        }
        default:
            return 0;
    }
};

/**
 * Get the point value of a playing card.
 * @param card to evaluate
 * @returns point value of the card
 */
export const getCardPoints = (card: Card) => {
    switch (card.rank) {
        case CARD_RANK.QUEEN:
            return 3;
        case CARD_RANK.JACK:
            return 2;
        case CARD_RANK.ACE:
            return 11;
        case CARD_RANK.TEN:
            return 10;
        case CARD_RANK.KING:
            return 4;
        default:
            return 0;
    }
};

export const countCardPoints = (cards: Card[]) => {
    return cards.reduce((acc, card) => acc + getCardPoints(card), 0);
}

/**
 * Comparison function used for sorting playing cards by rank and suit.
 * @param a PlayingCard
 * @param b PlayingCard
 * @returns -1 if a < b, 0 if a == b, 1 if a > b
 */
export const sortCards = (a: Card, b: Card) => {
    if (a.rank === b.rank && a.suit === b.suit) {
        // Same card
        return 0;
    } else if ((isTrumpCard(a) && isTrumpCard(b)) || a.suit === b.suit) {
        // Both are trump or of same suit, compare rank values
        return getCardinalRank(a) - getCardinalRank(b);
    } else if (isTrumpCard(a)) {
        // Trump cards come first
        return 1;
    } else if (isTrumpCard(b)) {
        // Trump cards come first
        return -1;
    } else if (a.suit === CARD_SUIT.CLUB) {
        // Clubs before hearts
        return 1;
    } else if (b.suit === CARD_SUIT.CLUB) {
        // Clubs before hearts
        return -1;
    } else if (a.suit === CARD_SUIT.HEART) {
        // Hearts before spades
        return 1;
    } else if (b.suit === CARD_SUIT.HEART) {
        // Hearts before spades
        return -1;
    } else if (a.suit === CARD_SUIT.SPADE) {
        // Spades last
        return 1;
    } else if (b.suit === CARD_SUIT.SPADE) {
        // Spades last
        return 0;
    } else {
        // Unknown case (unreachable?)
        return 0;
    }
};

/**
 * Returns true if the hand contains the card, false otherwise.
 */
export const handContainsCard = (hand: Card[], card: Card) => {
    return hand.some((c) => c.rank === card.rank && c.suit === card.suit);
};

export const prettyPrintCard = (card: Card) => {
    return `${capitalize(card?.rank)} of ${capitalize(card?.suit)}`;
}

export const compareCards = (a: Card, b: Card, leadingSuit: CardSuit) => {
    if (isTrumpCard(a) && !isTrumpCard(b)) {
        return true;
    } else if (!isTrumpCard(a) && isTrumpCard(b)) {
        return false;
    } else if (isTrumpCard(a) && isTrumpCard(b)) {
        return getCardinalRank(a) - getCardinalRank(b) > 0;
    } else if (a.suit === leadingSuit && b.suit !== leadingSuit) {
        return true;
    } else if (a.suit !== leadingSuit && b.suit === leadingSuit) {
        return false;
    } else {
        return getCardinalRank(a) - getCardinalRank(b) > 0;
    }
}