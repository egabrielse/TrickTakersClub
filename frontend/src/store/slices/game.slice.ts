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
    handsPlayed: number;
}

const initialState: GameState = {
    inProgress: false,
    scoreboard: [],
    playerOrder: [],
    handsPlayed: 0,
};


const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        reset: () => initialState,
        initialize: (state, action: PayloadAction<MessageData<InitializeMessage>>) => {
            state.inProgress = action.payload.inProgress;
            state.scoreboard = action.payload.scoreboard || [];
            state.handsPlayed = action.payload.handsPlayed || 0;
            state.playerOrder = action.payload.playerOrder || [];
        },
        gameStarted: (state, action: PayloadAction<MessageData<GameStartedMessage>>) => {
            state.inProgress = true;
            state.scoreboard = createNewScoreboard(action.payload.playerOrder)
            state.handsPlayed = 0;
            state.playerOrder = action.payload.playerOrder;
        },
        handDone: (state, action: PayloadAction<MessageData<HandDoneMessage>>) => {
            const { summary } = action.payload;
            state.scoreboard = state.scoreboard.map((row) => ({
                playerId: row.playerId,
                score: row.score += summary.scores[row.playerId],
                totalPoints: row.totalPoints += summary.pointsWon[row.playerId],
                totalTricks: row.totalTricks += summary.tricksWon[row.playerId],
            }));
        },
        gameOver: (state) => {
            // Only set inProgress to false if the game is over
            // Other state can be displayed still via popup (e.g. hand summary)
            state.inProgress = false;
        }
    },
    selectors: {
        inProgress: (state: GameState) => state.inProgress,
        scoreboard: (state: GameState) => state.scoreboard,
        playerOrder: (state: GameState) => state.playerOrder,
        handsPlayed: (state: GameState) => state.handsPlayed,
    }
});

export default gameSlice;
