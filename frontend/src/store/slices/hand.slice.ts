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
    LastHandStatusMessage,
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
    dealerId?: string;
    upNextId?: string;
    phase: HandPhase;
    hand: Card[];
    bury: Card[];
    calledCard?: Card;
    pickerId?: string;
    partnerId?: string;
    tricks: Trick[];
    updates: UpdateMessages[];
    lastHand: Record<string, boolean>;
}

const initialState: HandState = {
    phase: HAND_PHASE.PICK,
    hand: [],
    bury: [],
    tricks: [],
    updates: [],
    lastHand: {},
};

const handSlice = createSlice({
    name: "hand",
    initialState,
    reducers: {
        reset: () => initialState,
        initialize: (state, action: PayloadAction<MessageData<InitializeMessage>>) => {
            state.dealerId = action.payload.dealerId;
            state.upNextId = action.payload.upNextId;
            state.phase = action.payload.phase || HAND_PHASE.PICK;
            state.lastHand = action.payload.lastHand || {};
            state.hand = [...(action.payload.hand || [])].sort(sortCards);
            state.bury = action.payload.bury || [];
            state.calledCard = action.payload.calledCard;
            state.pickerId = action.payload.pickerId;
            state.partnerId = action.payload.partnerId;
            state.tricks = action.payload.tricks || [];
            state.updates = [];
        },
        dealHand: (state, action: PayloadAction<MessageData<DealHandMessage>>) => {
            state.dealerId = action.payload.dealerId;
            state.hand = action.payload.cards.sort(sortCards);
            // Reset state for a new hand
            // First trick is always the pick order
            state.pickerId = undefined;
            state.partnerId = undefined;
            state.calledCard = undefined;
            state.bury = [];
            state.tricks = [{
                turnOrder: action.payload.pickOrder,
                cards: {},
            }];
            state.lastHand = {};
        },
        startNewTrick: (state, action: PayloadAction<MessageData<NewTrickMessage>>) => {
            state.tricks.push({
                turnOrder: action.payload.nextTrickOrder,
                cards: {},
            });
        },
        upNext: (state, action: PayloadAction<MessageData<UpNextMessage>>) => {
            state.upNextId = action.payload.playerId;
            state.phase = action.payload.phase;
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
        cardPlayed: (
            state,
            action: PayloadAction<MessageData<CardPlayedMessage>>,
        ) => {
            const { playerId, card } = action.payload;
            state.hand = state.hand.filter(
                (c) => !(c.rank === card.rank && c.suit === card.suit),
            );
            if (state.tricks.length) {
                state.tricks[state.tricks.length - 1].cards[playerId] = card;
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
        updateLastHandStatus: (state, action: PayloadAction<MessageData<LastHandStatusMessage>>) => {
            const { playerId, lastHand } = action.payload;
            state.lastHand[playerId] = lastHand;
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
        leadingCard: (state: HandState) => {
            if (state.tricks.length) {
                const currentTrick = state.tricks[state.tricks.length - 1]
                return currentTrick && currentTrick.cards[currentTrick.turnOrder[0]];
            }
            return null;
        },
        tricks: (state: HandState) => state.tricks,
        currentTrick: (state: HandState) => {
            if (state.tricks.length) {
                return state.tricks[state.tricks.length - 1];
            }
            return null;
        },
        updates: (state: HandState) => state.updates,
        lastHand: (state: HandState) => state.lastHand,
        isLastHand: (state: HandState) => Object.values(state.lastHand).some((v) => v),
    },
});

export default handSlice;
