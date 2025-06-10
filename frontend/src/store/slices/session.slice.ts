import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameSettings } from "../../types/game";
import { GAME_SETTINGS_DEFAULTS } from "../../constants/game";
import { ChatMessage } from "../../types/message/misc";
import { EnteredEvent, LeftEvent, SettingsUpdatedEvent, WelcomeEvent } from "../../types/message/event";
import { MessageData } from "../../types/message";

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
        welcome: (state, action: PayloadAction<MessageData<WelcomeEvent>>) => {
            state.sessionId = action.payload.sessionId;
            state.hostId = action.payload.hostId;
            state.presence = action.payload.presence;
            state.settings = action.payload.settings || initialState.settings;
        },
        pushChatMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.chat.push(action.payload);
        },
        playerEntered: (state, action: PayloadAction<MessageData<EnteredEvent>>) => {
            if (!state.presence.includes(action.payload.playerId)) {
                state.presence.push(action.payload.playerId);
            }
        },
        playerLeft: (state, action: PayloadAction<MessageData<LeftEvent>>) => {
            state.presence = state.presence.filter(userId => userId !== action.payload.playerId);
        },
        settingsUpdated: (state, action: PayloadAction<MessageData<SettingsUpdatedEvent>>) => {
            state.settings = action.payload.settings;
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
