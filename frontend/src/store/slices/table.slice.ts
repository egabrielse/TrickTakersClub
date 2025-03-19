import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatMessage, SatDownMessage, SettingsUpdatedMessage, StoodUpMessage } from "../../types/message/broadcast";
import { GameSettings } from "../../types/game";
import { GAME_SETTINGS_DEFAULTS } from "../../constants/game";
import { MessageData } from "../../types/message/data";
import { InitializeMessage } from "../../types/message/direct";

interface TableState {
    chat: ChatMessage[];
    hostId: string;
    tableId: string;
    refreshed: boolean;
    seating: string[];
    settings: GameSettings;
}

const initialState: TableState = {
    chat: [],
    hostId: "",
    tableId: "",
    refreshed: false,
    seating: [],
    settings: {
        callingMethod: GAME_SETTINGS_DEFAULTS.CALLING_METHODS.ID,
        noPickResolution: GAME_SETTINGS_DEFAULTS.NO_PICK_RESOLUTIONS.ID,
        doubleOnTheBump: GAME_SETTINGS_DEFAULTS.DOUBLE_ON_THE_BUMP,
        blitzing: GAME_SETTINGS_DEFAULTS.BLITZING,
        cracking: GAME_SETTINGS_DEFAULTS.CRACKING,
    },
};


const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        reset: () => initialState,
        initialize: (state, action: PayloadAction<MessageData<InitializeMessage>>) => {
            state.refreshed = true;
            state.tableId = action.payload.tableId;
            state.hostId = action.payload.hostId;
            state.tableId = action.payload.tableId;
            state.hostId = action.payload.hostId;
            state.seating = action.payload.seating;
            state.settings = action.payload.settings;
        },
        chatMessageReceived: (state, action: PayloadAction<ChatMessage>) => {
            state.chat.push(action.payload);
        },
        settingsUpdated: (state, action: PayloadAction<MessageData<SettingsUpdatedMessage>>) => {
            state.settings = action.payload.settings;
        },
        satDown: (state, action: PayloadAction<MessageData<SatDownMessage>>) => {
            state.seating = [...state.seating, action.payload.playerId]
        },
        stoodUp: (state, action: PayloadAction<MessageData<StoodUpMessage>>) => {
            state.seating = state.seating.filter((playerId) => playerId !== action.payload.playerId);
        },
        resetSeating: (state) => {
            state.seating = [state.hostId]
        },
    },
    selectors: {
        chat: (state: TableState) => state.chat,
        chatLength: (state: TableState) => state.chat.length,
        hostId: (state: TableState) => state.hostId,
        tableId: (state: TableState) => state.tableId,
        refreshed: (state: TableState) => state.refreshed,
        seating: (state: TableState) => state.seating,
        settings: (state: TableState) => state.settings,
    }
});

export default tableSlice;
