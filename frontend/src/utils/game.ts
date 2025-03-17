import { Scoreboard, Trick } from "../types/game";
import { compareCards } from "./card";

export const createNewScoreboard = (playerOrder?: string[]) => {
    const scoreboard: Scoreboard = {
        rows: {},
        handsPlayed: 0,
    };
    if (playerOrder) {
        playerOrder.forEach((playerId) => {
            scoreboard.rows[playerId] = ({ score: 0, handsWon: 0 });
        });
    }
    return scoreboard;
}

/**
 * Returns true if the trick is done.
 */
export const isTrickDone = (trick: Trick) => {
    return trick.turnOrder.length === Object.keys(trick.cards).length;
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
            if (takerId === "" || compareCards(trick.cards[playerId], trick.cards[takerId], leadingCard.suit) > 0) {
                takerId = playerId;
            }
        }
        return takerId;
    }
    return "";
}
