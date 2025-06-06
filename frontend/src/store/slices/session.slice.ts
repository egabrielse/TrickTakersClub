import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameSettings } from "../../types/game";
import { GAME_SETTINGS_DEFAULTS } from "../../constants/game";
import { ChatMessage, EnteredMessage, LeftMessage, SettingsUpdatedMessage, WelcomeMessage } from "../../types/message";

interface SessionState {
    chat: ChatMessage[];
    hostId: string;
    sessionId: string;
    presence: string[];
    settings: GameSettings;
}

const initialState: SessionState = {
    chat: [],
    hostId: "",
    sessionId: "",
    presence: [],
    settings: {
        callingMethod: GAME_SETTINGS_DEFAULTS.CALLING_METHODS.ID,
        noPickResolution: GAME_SETTINGS_DEFAULTS.NO_PICK_RESOLUTIONS.ID,
        doubleOnTheBump: GAME_SETTINGS_DEFAULTS.DOUBLE_ON_THE_BUMP,
        blitzing: GAME_SETTINGS_DEFAULTS.BLITZING,
        cracking: GAME_SETTINGS_DEFAULTS.CRACKING,
    },
};


const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        reset: () => initialState,
        welcome: (state, action: PayloadAction<WelcomeMessage>) => {
            state.sessionId = action.payload.payload.sessionId;
            state.hostId = action.payload.payload.hostId;
            state.presence = action.payload.payload.presence;
            state.settings = action.payload.payload.settings || initialState.settings;
        },
        pushChatMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.chat.push(action.payload);
        },
        playerEntered: (state, action: PayloadAction<EnteredMessage>) => {
            if (!state.presence.includes(action.payload.payload.playerId)) {
                state.presence.push(action.payload.payload.playerId);
            }
        },
        playerLeft: (state, action: PayloadAction<LeftMessage>) => {
            state.presence = state.presence.filter(userId => userId !== action.payload.payload.playerId);
        },
        settingsUpdated: (state, action: PayloadAction<SettingsUpdatedMessage>) => {
            state.settings = action.payload.payload.settings;
        },
        resetSeating: (state) => {
            state.presence = [];
        },
    },
    selectors: {
        chat: (state: SessionState) => state.chat,
        chatLength: (state: SessionState) => state.chat.length,
        hostId: (state: SessionState) => state.hostId,
        sessionId: (state: SessionState) => state.sessionId,
        presence: (state: SessionState) => state.presence,
        settings: (state: SessionState) => state.settings,
    }
});

export default sessionSlice;
