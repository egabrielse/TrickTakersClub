import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { SettingsEntity } from "../../types/settings";
import { ASYNC_STATUS, } from "../../constants/api";
import { fetchSettings, saveSettings } from "../../api/settings.api";
import { AsyncStatus } from "../../types/api";


const initialState: {
    settings: SettingsEntity,
    status: AsyncStatus,
    error: SerializedError | null,
} = {
    settings: {
        soundOn: true,
        chatOpen: true,
    },
    status: ASYNC_STATUS.IDLE,
    error: null,
}

const asyncFetchSettings = createAsyncThunk(
    'user/fetchSettings',
    async (): Promise<SettingsEntity> => {
        const response = await fetchSettings();
        return response;
    }
)

const asyncUpdateSettings = createAsyncThunk(
    'user/saveSettings',
    async (settings: SettingsEntity): Promise<SettingsEntity> => {
        const res = await saveSettings(settings);
        return res;
    }
)

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch Settings
        builder.addCase(asyncFetchSettings.pending, (state) => {
            state.status = ASYNC_STATUS.PENDING;
            state.error = null;
        });
        builder.addCase(asyncFetchSettings.fulfilled, (state, action) => {
            state.status = ASYNC_STATUS.FULFILLED;
            state.settings = action.payload;
        });
        builder.addCase(asyncFetchSettings.rejected, (state, action) => {
            state.status = ASYNC_STATUS.REJECTED;
            state.error = action.error;
        });
        // Update Settings
        builder.addCase(asyncUpdateSettings.pending, (state, action) => {
            state.status = ASYNC_STATUS.PENDING;
            state.error = null;
            // Update settings optimistically (if fails, will revert back on page refresh)
            state.settings = action.meta.arg;
        });
        builder.addCase(asyncUpdateSettings.fulfilled, (state, action) => {
            state.status = ASYNC_STATUS.FULFILLED;
            state.settings = action.payload;
        });
        builder.addCase(asyncUpdateSettings.rejected, (state, action) => {
            state.status = ASYNC_STATUS.REJECTED;
            state.error = action.error;
        });
    },
    selectors: {
        settings: (state) => state.settings,
        error: (state) => state.error,
        soundOn: (state) => state.settings.soundOn,
        chatOpen: (state) => state.settings.chatOpen,
    }
});

export default {
    ...settingsSlice,
    actions: {
        ...settingsSlice.actions,
        asyncFetchSettings,
        asyncUpdateSettings,
    }
};
