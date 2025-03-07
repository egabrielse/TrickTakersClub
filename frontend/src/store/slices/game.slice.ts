import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Scoreboard } from "../../types/game";
import { MessageData } from "../../types/message/data";
import { InitializeMessage } from "../../types/message/direct";
import { GameStartedMessage, HandDoneMessage } from "../../types/message/broadcast";
import { createNewScoreboard } from "../../utils/game";

interface GameState {
    inProgress: boolean;
    scoreboard: Scoreboard;
    playerOrder: string[];
}

const initialState: GameState = {
    inProgress: false,
    scoreboard: createNewScoreboard(),
    playerOrder: [],
};


const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        reset: () => initialState,
        initialize: (state, action: PayloadAction<MessageData<InitializeMessage>>) => {
            state.inProgress = action.payload.inProgress;
            state.scoreboard = action.payload.scoreboard || createNewScoreboard(action.payload.playerOrder);
            state.playerOrder = action.payload.playerOrder || [];
        },
        gameStarted: (state, action: PayloadAction<MessageData<GameStartedMessage>>) => {
            state.inProgress = true;
            state.scoreboard = createNewScoreboard(action.payload.playerOrder)
            state.playerOrder = action.payload.playerOrder;
        },
        handDone: (state, action: PayloadAction<MessageData<HandDoneMessage>>) => {
            state.scoreboard = action.payload.scoreboard;
        },
    },
    selectors: {
        inProgress: (state: GameState) => state.inProgress,
        scoreboard: (state: GameState) => state.scoreboard,
        playerOrder: (state: GameState) => state.playerOrder,
    }
});

export default gameSlice;
