import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Scoreboard } from "../../types/game";
import { createNewScoreboard } from "../../utils/game";
import { MessageData } from "../../types/message";
import { GameOnEvent, HandDoneEvent, WelcomeEvent } from "../../types/message/event";

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
        welcome: (state, action: PayloadAction<MessageData<WelcomeEvent>>) => {
            state.inProgress = action.payload.inProgress;
            state.scoreboard = action.payload.scoreboard || createNewScoreboard(action.payload.playerOrder);
            state.playerOrder = action.payload.playerOrder || [];
        },
        gameOn: (state, action: PayloadAction<MessageData<GameOnEvent>>) => {
            state.inProgress = true;
            state.scoreboard = createNewScoreboard(action.payload.playerOrder)
            state.playerOrder = action.payload.playerOrder;
        },
        handDone: (state, action: PayloadAction<MessageData<HandDoneEvent>>) => {
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
