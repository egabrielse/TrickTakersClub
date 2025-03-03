import { CARD_RANK, CARD_SUIT } from "../constants/card";
import { CardSuit, PlayingCard } from "../types/card";
import { Scoreboard, Trick } from "../types/game";
import { compareCards, isTrumpCard } from "./card";

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

export const arrangeSeats = (playerOrder: string[]) => {
    const ZERO = "0px";
    const HALF = "50%";
    const QUARTER = "25%";
    const seats: HTMLElement[] = [];
    playerOrder.forEach((playerId) => {
        const seat = document.getElementById(`seat-${playerId}`);
        if (seat) {
            seats.push(seat);
        }
    });

    switch (seats.length) {
        case 3: {
            // Player 1 (bottom center)
            // seats[0].style.left = `${width / 2 - seats[0].clientWidth / 2}px`;
            seats[0].style.left = HALF;
            seats[0].style.transform = `translateX(-${HALF})`;
            seats[0].style.bottom = ZERO;
            // Player 2 (top left corner)
            seats[1].style.left = ZERO;
            seats[1].style.top = ZERO;
            // Player 3 (top right corner)
            seats[2].style.right = ZERO;
            seats[2].style.top = ZERO;
            break;
        }
        case 4: {
            // Player 1 (bottom center)
            seats[0].style.left = HALF;
            seats[0].style.transform = `translateX(-${HALF})`;
            seats[0].style.bottom = ZERO;
            // Player 2 ( left center)
            seats[1].style.left = ZERO;
            seats[1].style.top = HALF;
            seats[1].style.transform = `translateY(-${HALF})`;
            // Player 3 (top center)
            seats[2].style.left = HALF;
            seats[2].style.transform = `translateX(-${HALF})`;
            seats[2].style.top = ZERO;
            // Player 4 (right center)
            seats[3].style.right = ZERO;
            seats[3].style.top = HALF;
            seats[3].style.transform = `translateY(-${HALF})`;
            break;
        }
        case 5: {
            // Player 1 (bottom center)
            seats[0].style.left = HALF;
            seats[0].style.transform = `translateX(-${HALF})`;
            seats[0].style.bottom = ZERO;
            // Player 2 (left center)
            seats[1].style.left = ZERO;
            seats[1].style.top = HALF;
            seats[1].style.transform = `translateY(-${HALF})`;
            // Player 3 (top quarter from left)
            seats[2].style.left = QUARTER;
            seats[2].style.transform = `translateX(-${QUARTER})`;
            seats[2].style.top = ZERO;
            // Player 4 (top quarter from right)
            seats[3].style.right = QUARTER;
            seats[3].style.transform = `translateX(${QUARTER})`;
            seats[3].style.top = ZERO;
            // Player 5 (right center)
            seats[4].style.right = ZERO;
            seats[4].style.top = HALF;
            seats[4].style.transform = `translateY(-${HALF})`;
            break;
        }
        default:
            console.warn("Unsupported number of seats");
    }
}

export const createNewScoreboard = (playerOrder: string[]) => {
    const scoreboard: Scoreboard = [];
    playerOrder.forEach((playerId) => {
        scoreboard.push({ playerId, score: 0, totalPoints: 0, totalTricks: 0 });
    });
    return scoreboard;
}

/**
 * Returns a list of callable aces given a picker's hand.
 * The picker can call an ace so long as they don't have it in their hand
 * and they have a fail suit of that ace in their hand.
 * @param hand - list of cards in picker's hand
 * @returns list of callable aces
 */
export const findCallableAces = (hand: PlayingCard[]) => {
    const failSuit: Record<CardSuit, boolean> = {
        [CARD_SUIT.CLUB]: false,
        [CARD_SUIT.HEART]: false,
        [CARD_SUIT.SPADE]: false,
        [CARD_SUIT.DIAMOND]: false
    }

    const aces: Record<CardSuit, boolean> = {
        [CARD_SUIT.CLUB]: false,
        [CARD_SUIT.HEART]: false,
        [CARD_SUIT.SPADE]: false,
        [CARD_SUIT.DIAMOND]: false
    }

    hand.forEach((card) => {
        if (card.rank === CARD_RANK.ACE) {
            aces[card.suit] = true;
        } else if (!isTrumpCard(card)) {
            failSuit[card.suit] = true;
        }
    })

    return Object.entries(aces).filter(([suit, hasAce]) => {
        const hasFailSuit = failSuit[suit as CardSuit];
        return !hasAce && hasFailSuit
    }).map(([suit]) => ({ suit, rank: CARD_RANK.ACE } as PlayingCard));
}

/**
 * Returns true if the trick is done.
 */
export const isTrickDone = (trick: Trick) => {
    return trick.turnOrder.length === Object(trick.cards).length;
}

/**
 * Returns the id of the player who won the trick.
 * @param trick - the trick to evaluate
 */
export const getTakerId = (trick: Trick) => {
    if (isTrickDone(trick)) {
        let takerId = "";
        const leadingCard = trick.cards[trick.turnOrder[0]];
        for (const playerId of trick.turnOrder) {
            if (takerId === "" || compareCards(trick.cards[playerId], trick.cards[takerId], leadingCard.suit)) {
                takerId = playerId;
            }
        }
        return takerId;
    }
    return "";
}
