import { createSelector } from "@reduxjs/toolkit";
import handSlice from "./slices/hand.slice";
import { countCardPoints, hasCard, isTrumpCard } from "../utils/card";
import authSlice from "./slices/auth.slice";
import gameSlice from "./slices/game.slice";
import { getTakerId, isTrickDone } from "../utils/game";
import { CARD_RANK, CARD_SUIT } from "../constants/card";
import { Card, FailSuit } from "../types/card";
import { HAND_PHASE, HAND_SIZE } from "../constants/game";
import { Trick } from "../types/game";
import sessionSlice from "./slices/session.slice";

/**
 * True if the user is the picker, false otherwise.
 */
export const isPicker = (uid: string, pickerId: string) => pickerId === uid;

// Selector for isPicker
export const selectIsPicker = createSelector([
    authSlice.selectors.uid,
    handSlice.selectors.pickerId,
], isPicker);

/**
 * True if the user is the partner, false otherwise.
 */
export const isPartner = (uid: string, partnerId: string, calledCard: Card | null, hand: Card[]) => {
    return partnerId === uid || Boolean(calledCard && hasCard(hand, calledCard));
};

// Selector for isPartner
export const selectIsPartner = createSelector([
    authSlice.selectors.uid,
    handSlice.selectors.partnerId,
    handSlice.selectors.calledCard,
    handSlice.selectors.hand,
], isPartner);

/**
 * True if the user is up next, false otherwise.
 */
export const isUpNext = (uid: string, upNextId: string) => upNextId === uid;

// Selector for isUpNext
export const selectIsUpNext = createSelector([
    authSlice.selectors.uid,
    handSlice.selectors.upNextId,
], isUpNext);

/**
 * True if the user is the host, false otherwise.
 */
export const isHost = (uid: string, hostId: string) => hostId === uid;

// Selector for isHost
export const selectIsHost = createSelector([
    authSlice.selectors.uid,
    sessionSlice.selectors.hostId,
], isHost);

/**
 * True if the user is present in the session, false otherwise.
 */
export const isPresent = (presence: string[], uid: string) => presence.includes(uid);

// Selector for isPresent
export const selectIsPresent = createSelector([
    sessionSlice.selectors.presence,
    authSlice.selectors.uid,
], isPresent);


/**
 * Returns a list of playable cards for the user.
 */
export const selectPlayableCards = createSelector([
    selectIsUpNext,
    selectIsPicker,
    selectIsPartner,
    handSlice.selectors.hand,
    handSlice.selectors.calledCard,
    handSlice.selectors.leadingCard,
    handSlice.selectors.partnerRevealed,
], (isUpNext, isPicker, isPartner, hand, calledCard, leadingCard, partnerRevealed) => {
    // TODO: Need to have a better logic for this function.
    if (!isUpNext) {
        return [];
    }
    const leadingSuit = leadingCard?.suit;
    const trumpLead = leadingCard ? isTrumpCard(leadingCard) : false;
    const cardsThatFollowSuit = hand.filter((card) => {
        if (trumpLead) {
            return isTrumpCard(card);
        } else {
            return card.suit === leadingSuit && !isTrumpCard(card);
        }
    });
    if (!leadingSuit) {
        // Player leads the trick and can play any card 
        // (except the partner, who cannot play the called card)
        if (isPartner && !partnerRevealed) {
            return hand.filter((card) => card.suit !== calledCard?.suit || isTrumpCard(card));
        } else if (isPicker && calledCard && !partnerRevealed) {
            // Picker has a partner and partner has not been revealed
            // Picker cannot lead with the called suit
            return hand.filter((card) => card.suit !== calledCard.suit || isTrumpCard(card));

        }
        return hand;
    } else if (cardsThatFollowSuit.length > 0) {
        // If following and player can follow suit, they must
        const calledSuitLead = calledCard?.suit === leadingSuit;
        if (isPartner && calledSuitLead && !partnerRevealed) {
            // Partner is being flushed out and must play the called card
            return [calledCard];
        }
        return cardsThatFollowSuit;
    } else if (isPicker && calledCard && !partnerRevealed) {
        // Picker has a partner and partner has not been revealed
        // Picker must retain at least one fail suit card of the called card, until it is led
        const count = hand.filter((card) => card.suit === calledCard.suit && !isTrumpCard(card)).length;
        if (count === 1) {
            return hand.filter((card) => card.suit !== calledCard.suit || isTrumpCard(card));
        }
        return hand;
    } else {
        return hand;
    }
});

/**
 * Returns a list of callable aces for the user.
 */
export const callableAces = (hand: Card[], bury: Card[]): Record<FailSuit, boolean> => {
    const cards = [...hand, ...bury];
    const aces: Record<FailSuit, boolean> = {
        [CARD_SUIT.CLUB]: false,
        [CARD_SUIT.HEART]: false,
        [CARD_SUIT.SPADE]: false,
    }
    for (const key in aces) {
        const hasAce = cards.some((card) => card.rank === CARD_RANK.ACE && card.suit === key);
        const holdsFailSuit = hand.some((card) => !isTrumpCard(card) && card.suit === key);
        if (!hasAce && holdsFailSuit) {
            aces[key as FailSuit] = true;
        }
    }
    return aces;
}

// Selector for callableAces
export const selectCallableAces = createSelector([
    handSlice.selectors.hand,
    handSlice.selectors.bury,
], callableAces);


/**
 * Returns the player order starting with the user.
 */
export const playerOrderStartingWithUser = (playerOrder: string[], uid: string) => {
    const index = playerOrder.indexOf(uid);
    if (index === -1) {
        return playerOrder
    }
    return [...playerOrder.slice(index), ...playerOrder.slice(0, index)];
}

// Selector for playerOrderStartingWithUser
export const selectPlayerOrderStartingWithUser = createSelector([
    gameSlice.selectors.playerOrder,
    authSlice.selectors.uid,
], playerOrderStartingWithUser);


/**
 * Sums the number of tricks and points won by each player.
 * @param playerOrder list of player IDs
 * @param completedTricks list of completed tricks to tally
 * @return Map of player IDs to [number of tricks won, total points won]
 */
export const tallyCompletedTricks = (playerOrder: string[], completedTricks: Trick[]) => {
    const count: Record<string, [number, number]> = {};
    playerOrder.forEach((playerId) => {
        count[playerId] = [0, 0];
    });
    completedTricks.filter((trick) => isTrickDone(trick)).forEach((trick) => {
        const takerId = getTakerId(trick);
        const points = countCardPoints(Object.values(trick.cards));
        if (takerId) {
            count[takerId][0] += 1;
            count[takerId][1] += points;
        }
    });
    return count;
}

// Selector for tallyCompletedTricks
export const selectTallyCompletedTricks = createSelector([
    gameSlice.selectors.playerOrder,
    handSlice.selectors.completedTricks,
], tallyCompletedTricks);


/**
 * Calculates the number of cards left in each player's hand.
 * @returns Map of player IDs to the number of cards left in their hand
 */
export const cardsInHandCounts = (playerOrder: string[], completedTricks: number, currentTrick: Trick | null, phase: string, pickerId: string | undefined) => {
    // Calculate how many cards each player has left in their hand
    const handCounts: Record<string, number> = {};
    playerOrder.forEach((playerId) => {
        // Each player starts with 6 cards
        handCounts[playerId] = HAND_SIZE;
        // Subtract cards played in completed tricks
        handCounts[playerId] -= completedTricks;
        // Add 2 cards for the picker during the bury phase
        if (playerId === pickerId && phase === HAND_PHASE.BURY) {
            handCounts[playerId] += 2;
        }
        if (currentTrick && currentTrick.cards[playerId]) {
            // Remove card played in this trick
            handCounts[playerId] -= 1;
        }
    });
    return handCounts;
}

// Selector for cardsInHandCounts
export const selectCardsInHandCounts = createSelector([
    gameSlice.selectors.playerOrder,
    handSlice.selectors.countOfCompletedTricks,
    handSlice.selectors.currentTrick,
    handSlice.selectors.phase,
    handSlice.selectors.pickerId,
], cardsInHandCounts);
