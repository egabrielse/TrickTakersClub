import { CARD_RANK, CARD_SUIT } from "../constants/game";
import { CardSize, PlayingCard, Trick } from "../types/game";

/**
 * Arrange points on an ellipse given its width and height.
 * @param width of the ellipse
 * @param height of the ellipse
 * @param numPoints to arrange on the ellipse
 * @returns list of coordinates for the points on the ellipse
 */
export const arrangePointsOnEllipse = (
    width: number,
    height: number,
    numPoints: number
): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width / 2 * 0.9;
    const radiusY = height / 2 * 0.9;

    for (let i = 0; i < numPoints; i++) {
        const angle = Math.PI / 2 + (2 * Math.PI * i) / numPoints;
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);

        points.push({ x, y });
    }

    return points;
}

/**
 * Return the path to the face of the playing card.
 */
export const getCardFace = (card: PlayingCard) => {
    return `/cards/${card.rank}-${card.suit}.svg`
}

/**
 * Returns the path to the back of the playing card.
 */
export const getCardBack = (variant: number = 1) => {
    return `/cards/back-${variant}.svg`
}

/**
 * Determines if a given card is of the trump suit.
 * @param card to evaluate
 * @returns true if trump, false otherwise
 */
export const isTrump = (card: PlayingCard) => {
    return card.suit === CARD_SUIT.DIAMOND || card.rank === CARD_RANK.JACK || card.rank === CARD_RANK.QUEEN
}

/**
 * Get the cardinal rank of a playing card
 * @param card to evaluate
 * @returns number between 1 and 14 representing the card's rank
 */
export const getCardinalRank = (card: PlayingCard) => {
    switch (card.rank) {
        case CARD_RANK.SEVEN:
            return 1
        case CARD_RANK.EIGHT:
            return 2
        case CARD_RANK.NINE:
            return 3
        case CARD_RANK.KING:
            return 4
        case CARD_RANK.TEN:
            return 5
        case CARD_RANK.ACE:
            return 6
        case CARD_RANK.JACK: {
            switch (card.suit) {
                case CARD_SUIT.DIAMOND:
                    return 7
                case CARD_SUIT.HEART:
                    return 8
                case CARD_SUIT.SPADE:
                    return 9
                case CARD_SUIT.CLUB:
                    return 10
                default:
                    return 0
            }
        }
        case CARD_RANK.QUEEN: {
            switch (card.suit) {
                case CARD_SUIT.DIAMOND:
                    return 11
                case CARD_SUIT.HEART:
                    return 12
                case CARD_SUIT.SPADE:
                    return 13
                case CARD_SUIT.CLUB:
                    return 14
                default:
                    return 0
            }
        }
        default:
            return 0
    }
}

/**
 * Get the point value of a playing card.
 * @param card to evaluate
 * @returns point value of the card
 */
export const getCardPoints = (card: PlayingCard) => {
    switch (card.rank) {
        case CARD_RANK.QUEEN:
            return 3
        case CARD_RANK.JACK:
            return 2
        case CARD_RANK.ACE:
            return 11
        case CARD_RANK.TEN:
            return 10
        case CARD_RANK.KING:
            return 4
        default:
            return 0;
    }
}



/**
 * Comparison function used for sorting playing cards by rank and suit.
 * @param a Card
 * @param b Card
 * @returns -1 if a < b, 0 if a == b, 1 if a > b
 */
export const compareCards = ((a: PlayingCard | undefined, b: PlayingCard | undefined) => {
    if (!a || !b) {
        // One of the cards is undefined
        if (a && !b) {
            return 1 // a is undefined, b is not
        } else if (!a && b) {
            return -1 // b is undefined, a is not
        } else {
            return 0 // Both are undefined
        }
    } else if (isTrump(a) && !isTrump(b)) {
        // Trump before non-trump
        return 1
    } else if (!isTrump(a) && isTrump(b)) {
        // Trump before non-trump
        return -1
    } else if (isTrump(a) && isTrump(b) || a.suit === b.suit) {
        // Both trump or same suit, compare values
        return getCardinalRank(a) - getCardinalRank(b)
    } else if (a.suit === CARD_SUIT.CLUB) {
        // Clubs before other fail suits
        return 1
    } else if (a.suit === CARD_SUIT.HEART && !(b.suit === CARD_SUIT.SPADE)) {
        // Hearts before spades
        return 1
    } else {
        // Spades last
        return -1
    }
})

/**
 * Convert a CardSize to pixel dimensions.
 * @param size CardSize
 * @returns width and height in pixels
 */
export const cardSizeToPixels = (size: CardSize | undefined) => {
    let ratio = 1;
    if (size === "small") {
        ratio = 0.8
    } else if (size === "large") {
        ratio = 1.2
    }
    return { width: 63 * ratio, height: 88 * ratio };
}

/**
 * Summarize the tricks won by each player.
 * @param tricks 
 */
export const tallyTricks = (tricks: Trick[]) => {
    const summary: Record<string, number> = {};
    for (const trick of tricks) {
        const trickComplete = Object.entries(trick.cards).length === trick.turnOrder.length;
        if (trickComplete) {
            if (trick.takerId in summary) {
                summary[trick.takerId] += 1;
            } else {
                summary[trick.takerId] = 1;
            }
        }
    }
    return summary;
}

export const createNewScoreboard = (playerOrder: string[]) => {
    const scoreboard: Record<string, { score: number, totalPoints: number, totalTricks: number }> = {};
    playerOrder.forEach((playerId) => {
        scoreboard[playerId] = { score: 0, totalPoints: 0, totalTricks: 0 };
    });
    return scoreboard;
}