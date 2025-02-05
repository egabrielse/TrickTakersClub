import { CARD_RANK, CARD_SUIT } from "../constants/card";
import { CardSize, PlayingCard } from "../types/card";

/**
 * Return the path to the face of the playing card.
 */
export const getCardFace = (card: PlayingCard) => {
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
export const isTrump = (card: PlayingCard) => {
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
export const getCardinalRank = (card: PlayingCard) => {
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
export const getCardPoints = (card: PlayingCard) => {
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

/**
 * Comparison function used for sorting playing cards by rank and suit.
 * @param a Card
 * @param b Card
 * @returns -1 if a < b, 0 if a == b, 1 if a > b
 */
export const compareCards = (a: PlayingCard, b: PlayingCard) => {
    if (isTrump(a) && !isTrump(b)) {
        // Trump before non-trump
        return 1;
    } else if (!isTrump(a) && isTrump(b)) {
        // Trump before non-trump
        return -1;
    } else if ((isTrump(a) && isTrump(b)) || a.suit === b.suit) {
        // Both trump or same suit, compare values
        return getCardinalRank(a) - getCardinalRank(b);
    } else if (a.suit === CARD_SUIT.CLUB) {
        // Clubs before other fail suits
        return 1;
    } else if (b.suit === CARD_SUIT.CLUB) {
        // Clubs before other fail suits
        return -1;
    } else if (a.suit === CARD_SUIT.HEART && !(b.suit === CARD_SUIT.SPADE)) {
        // Hearts before spades
        return 1;
    } else if (b.suit === CARD_SUIT.HEART && !(a.suit === CARD_SUIT.SPADE)) {
        // Hearts before spades
        return -1;
    } else {
        // Spades last
        return -1;
    }
};

/**
 * Convert a CardSize to pixel dimensions.
 * @param size CardSize
 * @returns width and height in pixels
 */
export const cardSizeToPixels = (size: CardSize | undefined) => {
    let ratio = 1;
    if (size === "small") {
        ratio = 0.8;
    } else if (size === "large") {
        ratio = 1.2;
    }
    return { width: 63 * ratio, height: 88 * ratio };
};

/**
 * Returns true if the hand contains the card, false otherwise.
 */
export const handContainsCard = (hand: PlayingCard[], card: PlayingCard) => {
    return hand.some((c) => c.rank === card.rank && c.suit === card.suit);
};

/**
 * Returns all cards in the hand that can be played.
 * @param hand cards in the player's hand
 * @param leadingSuit suit of the leading card
 * @param calledCard card that was called
 * @param partnerRevealed 
 * @param isPicker 
 * @param isPartner 
 */
export const findPlayableCards = (
    hand: PlayingCard[],
    leadingCard: PlayingCard | undefined,
    calledCard: PlayingCard | null,
    partnerRevealed: boolean,
    isPicker: boolean,
    isPartner: boolean,
) => {
    const leadingSuit = leadingCard?.suit;
    const canFollowSuit = hand.some((card) => card.suit === leadingSuit);
    if (!leadingSuit) {
        // Player leads the trick and can play any card 
        // (except the partner, who cannot play the called card)
        return hand.filter((card) => card !== calledCard);
    } else if (canFollowSuit) {
        // If following and player can follow suit, they must
        const calledSuitLead = calledCard?.suit === leadingSuit;
        if (isPartner && calledSuitLead && !partnerRevealed) {
            // Partner is being flushed out and must play the called card
            return [calledCard];
        }
        return hand.filter((card) => card.suit === leadingSuit);
    } else if (isPicker && calledCard && !partnerRevealed) {
        // Picker has a partner and partner has not been revealed
        // Picker must retain at least one fail suit card of the called card, until it is led
        const count = hand.filter((card) => card.suit === calledCard.suit).length;
        if (count === 1) {
            return hand.filter((card) => card.suit !== calledCard.suit);
        } else {
            return hand;
        }
    } else {
        return hand;
    }

}
};