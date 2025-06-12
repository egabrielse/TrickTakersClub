import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatMessage } from "../../types/message/misc";
import { EnteredEvent, LeftEvent, WelcomeEvent } from "../../types/message/event";
import { MessageData } from "../../types/message";

interface SessionState {
    chat: ChatMessage[];
    hostId: string;
    sessionId: string;
    presence: string[];
}

const initialState: SessionState = {
    chat: [],
    hostId: "",
    sessionId: "",
    presence: [],
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
    },
    selectors: {
        chat: (state: SessionState) => state.chat,
        chatLength: (state: SessionState) => state.chat.length,
        hostId: (state: SessionState) => state.hostId,
        sessionId: (state: SessionState) => state.sessionId,
        presence: (state: SessionState) => state.presence,
    }
});

export default sessionSlice;
