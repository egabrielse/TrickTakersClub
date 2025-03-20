import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HAND_PHASE } from "../../constants/game";
import { Card } from "../../types/card";
import {
    HandPhase,
    Trick,
    UpdateMessages,
} from "../../types/game";
import {
    BlindPickedMessage,
    CalledCardMessage,
    CardPlayedMessage,
    NewTrickMessage,
    PartnerRevealedMessage,
    UpNextMessage,
} from "../../types/message/broadcast";
import { MessageData } from "../../types/message/data";
import {
    BuriedCardsMessage,
    DealHandMessage,
    InitializeMessage,
    PickedCardsMessage,
} from "../../types/message/direct";
import { sortCards } from "../../utils/card";

interface HandState {
    dealerId: string;
    upNextId: string;
    phase: HandPhase;
    hand: Card[];
    bury: Card[];
    goneAlone: boolean;
    calledCard: Card | null;
    pickerId: string;
    partnerId: string;
    currentTrick: Trick | null;
    completedTricks: Trick[];
    updates: UpdateMessages[];
    isLastHand: boolean;
    noPickHand: boolean;
}

const initialState: HandState = {
    phase: HAND_PHASE.PICK,
    hand: [],
    bury: [],
    dealerId: "",
    upNextId: "",
    pickerId: "",
    partnerId: "",
    calledCard: null,
    currentTrick: null,
    completedTricks: [],
    updates: [],
    isLastHand: false,
    noPickHand: false,
    goneAlone: false,
};

const handSlice = createSlice({
    name: "hand",
    initialState,
    reducers: {
        reset: () => initialState,
        initialize: (state, action: PayloadAction<MessageData<InitializeMessage>>) => {
            const { phase, isLastHand, hand, bury, calledCard, tricks } = action.payload;
            state.dealerId = action.payload.dealerId || "";
            state.upNextId = action.payload.upNextId || "";
            state.pickerId = action.payload.pickerId || "";
            state.partnerId = action.payload.partnerId || "";
            state.noPickHand = action.payload.noPickHand || false;
            state.calledCard = action.payload.calledCard || null;
            state.phase = phase || HAND_PHASE.PICK;
            state.isLastHand = isLastHand;
            state.hand = [...(hand || [])].sort(sortCards);
            state.bury = bury || [];
            state.goneAlone = phase === HAND_PHASE.PLAY && Boolean(!calledCard);
            state.currentTrick = tricks.length > 0 ? tricks[tricks.length - 1] : null;
            state.completedTricks = tricks.length > 0 ? tricks.slice(0, -1) : [];
            state.updates = [];
        },
        dealHand: (state, action: PayloadAction<MessageData<DealHandMessage>>) => {
            state.dealerId = action.payload.dealerId;
            state.hand = action.payload.cards.sort(sortCards);
            // Reset state for a new hand
            // First trick is always the pick order
            state.pickerId = "";
            state.partnerId = "";
            state.upNextId = "";
            state.calledCard = null;
            state.goneAlone = false;
            state.bury = [];
            state.currentTrick = null;
            state.completedTricks = [];
            state.isLastHand = false;
            state.noPickHand = false;
            state.phase = HAND_PHASE.PICK;
        },
        startNewTrick: (state, action: PayloadAction<MessageData<NewTrickMessage>>) => {
            if (state.currentTrick) {
                state.completedTricks.push({ ...state.currentTrick });
            }
            state.currentTrick = {
                turnOrder: action.payload.nextTrickOrder,
                cards: {},
            };
        },
        upNext: (state, action: PayloadAction<MessageData<UpNextMessage>>) => {
            state.upNextId = action.payload.playerId;
            state.phase = action.payload.phase;
        },
        noPickHand: (state) => {
            state.noPickHand = true;
        },
        blindPicked: (
            state,
            action: PayloadAction<MessageData<BlindPickedMessage>>,
        ) => {
            state.pickerId = action.payload.playerId;
        },
        pickedCards: (
            state,
            action: PayloadAction<MessageData<PickedCardsMessage>>,
        ) => {
            state.hand = [...state.hand, ...action.payload.cards].sort(sortCards);
        },
        buriedCards: (
            state,
            action: PayloadAction<MessageData<BuriedCardsMessage>>,
        ) => {
            const { cards } = action.payload;
            // Remove the buried cards from the player's hand
            state.hand = state.hand.filter((card) => {
                return !cards.find((b) => b.rank === card.rank && b.suit === card.suit);
            });
            // Add the buried cards to the bury pile
            state.bury = cards;
        },
        calledCard: (
            state,
            action: PayloadAction<MessageData<CalledCardMessage>>,
        ) => {
            state.calledCard = action.payload.card;
        },
        goneAlone: (state) => {
            state.goneAlone = true;
        },
        cardPlayed: (
            state,
            action: PayloadAction<MessageData<CardPlayedMessage>>,
        ) => {
            const { playerId, card } = action.payload;
            // Remove played card from player's hand
            state.hand = state.hand.filter(
                (c) => !(c.rank === card.rank && c.suit === card.suit),
            );
            if (state.currentTrick) {
                state.currentTrick.cards[playerId] = card;
            }
        },
        partnerRevealed: (
            state,
            action: PayloadAction<MessageData<PartnerRevealedMessage>>,
        ) => {
            state.partnerId = action.payload.playerId;
        },
        displayMessage: (state, action: PayloadAction<UpdateMessages>) => {
            state.updates.push(action.payload);
        },
        shiftUpdate: (state) => {
            state.updates.shift();
        },
        clearUpdates: (state) => {
            state.updates = [];
        },
        lastHand: (state) => {
            state.isLastHand = true;
        },
    },
    selectors: {
        dealerId: (state: HandState) => state.dealerId,
        upNextId: (state: HandState) => state.upNextId,
        pickerId: (state: HandState) => state.pickerId,
        partnerId: (state: HandState) => state.partnerId,
        partnerRevealed: (state: HandState) => state.partnerId !== "",
        phase: (state: HandState) => state.phase,
        hand: (state: HandState) => state.hand,
        bury: (state: HandState) => state.bury,
        calledCard: (state: HandState) => state.calledCard,
        goneAlone: (state: HandState) => state.goneAlone,
        leadingCard: (state: HandState) => {
            if (state.currentTrick) {
                return state.currentTrick.cards[state.currentTrick.turnOrder[0]];
            }
            return null;
        },
        completedTricks: (state: HandState) => state.completedTricks,
        countOfCompletedTricks: (state: HandState) => state.completedTricks.length,
        currentTrick: (state: HandState) => state.currentTrick,
        updates: (state: HandState) => state.updates,
        isLastHand: (state: HandState) => state.isLastHand,
        noPickHand: (state: HandState) => state.noPickHand,
    },
});

export default handSlice;
