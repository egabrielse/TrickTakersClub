import { createSelector } from "@reduxjs/toolkit";
import handSlice from "./slices/hand.slice";
import { handContainsCard, isTrumpCard } from "../utils/card";
import authSlice from "./slices/auth.slice";
import gameSlice from "./slices/game.slice";
import tableSlice from "./slices/table.slice";
import { relistStartingWith } from "../utils/list";

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
        return hand.filter((card) => card !== calledCard);
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
        const count = hand.filter((card) => card.suit === calledCard.suit).length;
        if (count === 1) {
            return hand.filter((card) => card.suit !== calledCard.suit);
        } else {
            return hand;
        }
    } else {
        return hand;
    }
});

/**
 * Returns the player order starting with the user.
 */
const playerOrderStartingWithUser = createSelector(
    [gameSlice.selectors.playerOrder, authSlice.selectors.uid],
    (playerOrder, uid) => relistStartingWith(playerOrder, uid)
);

const tricksWon = createSelector(
    [handSlice.selectors.summaries],
    (summaries) => summaries.reduce((prev: Record<string, number>, curr) => {
        if (curr.takerId) {
            prev[curr.takerId] = (prev[curr.takerId] || 0) + 1;
        }
        return prev;
    }, {})
)

const selectors = {
    isDealer,
    isPicker,
    isPartner,
    isUpNext,
    isHost,
    isSeated,
    playableCards,
    playerOrderStartingWithUser,
    tricksWon,
};

export default selectors;