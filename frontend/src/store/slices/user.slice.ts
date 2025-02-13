import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CachedUser } from "../../types/user";
import { fetchUserInfoById } from "../../api/user.api";
import { UserInfo } from "firebase/auth";
import { FETCH_STATUS } from "../../constants/api";


const initialState: Record<string, CachedUser> = {};

const asyncFetchUser = createAsyncThunk(
    'user/fetchUser',
    async (id: string): Promise<UserInfo> => {
        const response = await fetchUserInfoById(id);
        return response.user;
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder.addCase(asyncFetchUser.pending, (state, action) => {
            const playerId = action.meta.arg;
            if (!state[playerId]) {
                // User is not yet cached
                state[playerId] = {
                    user: undefined,
                    status: FETCH_STATUS.LOADING,
                    error: undefined,
                };
            } else {
                // Refreshing an existing user
                state[playerId].status = FETCH_STATUS.LOADING
                state[playerId].error = undefined;
            }
        });
        builder.addCase(asyncFetchUser.fulfilled, (state, action) => {
            const playerId = action.meta.arg;
            state[playerId].user = {
                uid: action.payload.uid,
                displayName: String(action.payload.displayName),
                email: String(action.payload.email),
            };
            state[playerId].status = FETCH_STATUS.LOADED;
            state[playerId].error = undefined;
        });
        builder.addCase(asyncFetchUser.rejected, (state, action) => {
            const playerId = action.meta.arg;
            state[playerId].status = FETCH_STATUS.ERROR;
            state[playerId].error = action.error.message;
        });
    },
    selectors: {
        users: (state: Record<string, CachedUser>) => state,
    }
});

export default {
    ...userSlice,
    actions: {
        ...userSlice.actions,
        asyncFetchUser,
    }
};
