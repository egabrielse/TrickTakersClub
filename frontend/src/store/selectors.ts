import { createSelector } from "@reduxjs/toolkit";
import handSlice from "./slices/hand.slice";
import { countCardPoints, handContainsCard, isTrumpCard } from "../utils/card";
import authSlice from "./slices/auth.slice";
import gameSlice from "./slices/game.slice";
import tableSlice from "./slices/table.slice";
import { getTakerId } from "../utils/game";
import { CARD_RANK, CARD_SUIT } from "../constants/card";
import { FailSuit } from "../types/card";

/**
 * True if the user is the dealer, false otherwise.
 */
const isDealer = createSelector([
    authSlice.selectors.uid,
    handSlice.selectors.dealerId,
], (uid, dealerId) => dealerId === uid);

/**
 * True if the user is the picker, false otherwise.
 */
const isPicker = createSelector([
    authSlice.selectors.uid,
    handSlice.selectors.pickerId,
], (uid, pickerId) => pickerId === uid);

/**
 * True if the user is the partner, false otherwise.
 */
const isPartner = createSelector([
    authSlice.selectors.uid,
    handSlice.selectors.partnerId,
    handSlice.selectors.calledCard,
    handSlice.selectors.hand,
], (uid, partnerId, calledCard, hand) => {
    return partnerId === uid || Boolean(calledCard && handContainsCard(hand, calledCard));
});

/**
 * True if the user is up next, false otherwise.
 */
const isUpNext = createSelector([
    authSlice.selectors.uid,
    handSlice.selectors.upNextId,
], (uid, upNextId) => upNextId === uid);

/**
 * True if the user is the host, false otherwise.
 */
const isHost = createSelector([
    authSlice.selectors.uid,
    tableSlice.selectors.hostId,
], (uid, hostId) => hostId === uid);


/**
 * True if the user is seated at the table, false otherwise.
 */
const isSeated = createSelector([
    tableSlice.selectors.seating,
    authSlice.selectors.uid,
], (seating, uid) => seating.includes(uid));

/**
 * Returns a list of playable cards for the user.
 */
const playableCards = createSelector([
    isUpNext,
    isPicker,
    isPartner,
    handSlice.selectors.hand,
    handSlice.selectors.calledCard,
    handSlice.selectors.leadingCard,
    handSlice.selectors.partnerRevealed,
], (isUpNext, isPicker, isPartner, hand, calledCard, leadingCard, partnerRevealed) => {
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
            return hand.filter((card) => card.suit !== calledCard.suit && isTrumpCard(card));
        } else {
            return hand;
        }
    } else {
        return hand;
    }
});

/**
 * Returns a list of callable aces for the user.
 */
const callableAces = createSelector([
    handSlice.selectors.hand,
    handSlice.selectors.bury,
], (hand, bury): Record<FailSuit, boolean> => {
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
});

/**
 * Returns the player order starting with the user.
 */
const playerOrderStartingWithUser = createSelector(
    [gameSlice.selectors.playerOrder, authSlice.selectors.uid],
    (playerOrder, uid) => {
        const index = playerOrder.indexOf(uid);
        if (index === -1) {
            return playerOrder
        }
        return [...playerOrder.slice(index), ...playerOrder.slice(0, index)];
    }
);

const tallyTricks = createSelector(
    [gameSlice.selectors.playerOrder, handSlice.selectors.tricks],
    (playerOrder, tricks) => {
        const count: Record<string, [number, number]> = {};
        playerOrder.forEach((playerId) => {
            count[playerId] = [0, 0];
        });
        tricks.forEach((trick) => {
            const takerId = getTakerId(trick);
            const points = countCardPoints(Object.values(trick.cards));
            if (takerId) {
                count[takerId][0] += 1;
                count[takerId][1] += points;
            }
        });
        return count;
    }
)

const selectors = {
    isDealer,
    isPicker,
    isPartner,
    isUpNext,
    isHost,
    isSeated,
    playableCards,
    callableAces,
    playerOrderStartingWithUser,
    tallyTricks,
};

export default selectors;