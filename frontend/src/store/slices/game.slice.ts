import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameSettings, Scoreboard } from "../../types/game";
import { createNewScoreboard } from "../../utils/game";
import { MessageData } from "../../types/message";
import { EnteredEvent, GameOnEvent, HandDoneEvent, LeftEvent, SettingsUpdatedEvent, WelcomeEvent } from "../../types/message/event";
import { GAME_SETTINGS_DEFAULTS, PLAYER_COUNT } from "../../constants/game";

interface GameState {
    inProgress: boolean;
    scoreboard: Scoreboard;
    seating: string[];
    settings: GameSettings;
}

const initialState: GameState = {
    inProgress: false,
    scoreboard: createNewScoreboard(),
    seating: Array(PLAYER_COUNT).fill(""),
    settings: {
        callingMethod: GAME_SETTINGS_DEFAULTS.CALLING_METHODS.ID,
        noPickResolution: GAME_SETTINGS_DEFAULTS.NO_PICK_RESOLUTIONS.ID,
        doubleOnTheBump: GAME_SETTINGS_DEFAULTS.DOUBLE_ON_THE_BUMP,
        blitzing: GAME_SETTINGS_DEFAULTS.BLITZING,
        cracking: GAME_SETTINGS_DEFAULTS.CRACKING,
    },
};


const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        reset: () => initialState,
        welcome: (state, action: PayloadAction<MessageData<WelcomeEvent>>) => {
            state.inProgress = action.payload.inProgress;
            state.scoreboard = action.payload.scoreboard || createNewScoreboard(action.payload.seating);
            state.seating = action.payload.seating || [];
            state.settings = action.payload.settings || initialState.settings;
        },
        playerEntered: (state, action: PayloadAction<MessageData<EnteredEvent>>) => {
            state.seating = action.payload.seating;
        },
        playerLeft: (state, action: PayloadAction<MessageData<LeftEvent>>) => {
            state.seating = action.payload.seating;
        },
        settingsUpdated: (state, action: PayloadAction<MessageData<SettingsUpdatedEvent>>) => {
            state.settings = action.payload.settings;
        },
        gameOn: (state, action: PayloadAction<MessageData<GameOnEvent>>) => {
            state.inProgress = true;
            state.scoreboard = createNewScoreboard(action.payload.seating);
            state.seating = action.payload.seating;
        },
        handDone: (state, action: PayloadAction<MessageData<HandDoneEvent>>) => {
            state.scoreboard = action.payload.scoreboard;
        },
    },
    selectors: {
        inProgress: (state: GameState) => state.inProgress,
        scoreboard: (state: GameState) => state.scoreboard,
        seating: (state: GameState) => state.seating,
        settings: (state: GameState) => state.settings,
    }
});

export default gameSlice;
