import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HandSummary, Scoreboard } from "../../types/game";
import { MessageData } from "../../types/message/data";
import { InitializeMessage } from "../../types/message/direct";
import { GameStartedMessage } from "../../types/message/broadcast";
import { createNewScoreboard } from "../../utils/game";

interface GameState {
    inProgress: boolean;
    scoreboard: Scoreboard;
    playerOrder: string[];
    handsPlayed: number;
    handSummary: HandSummary | null;
}

const initialState: GameState = {
    inProgress: false,
    scoreboard: [],
    playerOrder: [],
    handsPlayed: 0,
    handSummary: null,
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
        handDone: (state, action: PayloadAction<HandSummary>) => {
            if (action.payload) {
                // Set the hand summary in state to be displayed
                state.handsPlayed += 1;
                const playerSummaries = action.payload.playerSummaries;
                // Update the scoreboard
                state.scoreboard = state.scoreboard.map((row) => ({
                    playerId: row.playerId,
                    score: row.score += playerSummaries[row.playerId].score,
                    totalPoints: row.totalPoints += playerSummaries[row.playerId].points,
                    totalTricks: row.totalTricks += playerSummaries[row.playerId].tricks,
                }));
            }
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
        handSummary: (state: GameState) => state.handSummary,
    }
});

export default gameSlice;
