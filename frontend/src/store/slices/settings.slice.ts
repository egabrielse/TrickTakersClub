import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { UserSettingsEntity } from "../../types/user";
import { ASYNC_STATUS, } from "../../constants/api";
import { fetchUserSettings, saveUserSettings } from "../../api/userSettings.api";
import { AsyncStatus } from "../../types/api";


const initialState: {
    settings: UserSettingsEntity,
    status: AsyncStatus,
    error: SerializedError | null,
} = {
    settings: {
        soundOn: true,
    },
    status: ASYNC_STATUS.IDLE,
    error: null,
}

const asyncFetchUserSettings = createAsyncThunk(
    'user/fetchSettings',
    async (): Promise<UserSettingsEntity> => {
        const response = await fetchUserSettings();
        return response;
    }
)

const asyncSaveUserSettings = createAsyncThunk(
    'user/saveSettings',
    async (settings: UserSettingsEntity): Promise<UserSettingsEntity> => {
        await saveUserSettings(settings);
        return settings;
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
        builder.addCase(asyncFetchUserSettings.pending, (state) => {
            state.status = ASYNC_STATUS.PENDING;
            state.error = null;
        });
        builder.addCase(asyncFetchUserSettings.fulfilled, (state, action) => {
            state.status = ASYNC_STATUS.FULFILLED;
            state.settings = action.payload;
        });
        builder.addCase(asyncFetchUserSettings.rejected, (state, action) => {
            state.status = ASYNC_STATUS.REJECTED;
            state.error = action.error;
        });
        // Save Settings
        builder.addCase(asyncSaveUserSettings.pending, (state) => {
            state.status = ASYNC_STATUS.PENDING;
            state.error = null;
        });
        builder.addCase(asyncSaveUserSettings.fulfilled, (state, action) => {
            state.status = ASYNC_STATUS.FULFILLED;
            state.settings = action.payload;
        });
        builder.addCase(asyncSaveUserSettings.rejected, (state, action) => {
            state.status = ASYNC_STATUS.REJECTED;
            state.error = action.error;
        });
    },
    selectors: {
        settings: (state) => state.settings,
        error: (state) => state.error,
        soundOn: (state) => state.settings.soundOn,
    }
});

export default {
    ...settingsSlice,
    actions: {
        ...settingsSlice.actions,
        asyncFetchUserSettings,
        asyncSaveUserSettings,
    }
};
