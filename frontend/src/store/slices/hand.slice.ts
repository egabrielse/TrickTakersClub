import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HAND_PHASE } from "../../constants/game";
import { PlayingCard } from "../../types/card";
import {
    HandPhase,
    Trick,
    TrickSummary,
    UpdateMessages,
} from "../../types/game";
import {
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
import { compareCards } from "../../utils/card";
import { findCallableAces } from "../../utils/game";

interface HandState {
    dealerId?: string;
    upNextId?: string;
    phase: HandPhase;
    hand: PlayingCard[];
    bury: PlayingCard[];
    calledCard?: PlayingCard;
    pickerId?: string;
    partnerId?: string;
    currentTrick?: Trick;
    summaries: TrickSummary[];
    updates: UpdateMessages[];
}

const initialState: HandState = {
    phase: HAND_PHASE.SETUP,
    hand: [],
    bury: [],
    summaries: [],
    updates: [],
};

const handSlice = createSlice({
    name: "hand",
    initialState,
    reducers: {
        reset: () => initialState,
        initialize: (state, action: PayloadAction<MessageData<InitializeMessage>>) => {
            state.dealerId = action.payload.dealerId;
            state.upNextId = action.payload.upNextId;
            state.phase = action.payload.phase || HAND_PHASE.SETUP;
            state.hand = [...(action.payload.hand || [])].sort(compareCards);
            state.bury = action.payload.bury || [];
            state.calledCard = action.payload.calledCard;
            state.pickerId = action.payload.pickerId;
            state.partnerId = action.payload.partnerId;
            state.currentTrick = action.payload.currentTrick;
            state.summaries = action.payload.summaries || [];
            state.updates = [];
        },
        dealHand: (state, action: PayloadAction<MessageData<DealHandMessage>>) => {
            state.dealerId = action.payload.dealerId;
            state.hand = action.payload.cards.sort(compareCards);
        },
        startNewTrick: (state, action: PayloadAction<MessageData<NewTrickMessage>>) => {
            state.currentTrick = {
                turnOrder: action.payload.nextTrickOrder,
                cards: {},
            };
        },
        upNext: (state, action: PayloadAction<MessageData<UpNextMessage>>) => {
            state.upNextId = action.payload.playerId;
            state.phase = action.payload.phase;
        },
        pickedCards: (
            state,
            action: PayloadAction<MessageData<PickedCardsMessage>>,
        ) => {
            state.hand = [...state.hand, ...action.payload.cards].sort(compareCards);
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
        trickDone: (state, action: PayloadAction<TrickSummary>) => {
            state.summaries.push(action.payload);
        },
        gameOver: () => initialState,
        displayMessage: (state, action: PayloadAction<UpdateMessages>) => {
            state.updates.push(action.payload);
        },
        shiftUpdate: (state) => {
            state.updates.shift();
        },
        clearUpdates: (state) => {
            state.updates = [];
        }
    },
    selectors: {
        dealerId: (state: HandState) => state.dealerId,
        upNextId: (state: HandState) => state.upNextId,
        pickerId: (state: HandState) => state.pickerId,
        partnerId: (state: HandState) => state.partnerId,
        partnerRevealed: (state: HandState) => state.partnerId !== "",
        phase: (state: HandState) => state.phase,
        hand: (state: HandState) => state.hand,
        callableAces: (state: HandState) => findCallableAces(state.hand),
        bury: (state: HandState) => state.bury,
        calledCard: (state: HandState) => state.calledCard,
        leadingCard: (state: HandState) =>
            state.currentTrick &&
            state.currentTrick.cards[state.currentTrick.turnOrder[0]],
        currentTrick: (state: HandState) => state.currentTrick,
        summaries: (state: HandState) => state.summaries,
        updates: (state: HandState) => state.updates,
    },
});

export default handSlice;
