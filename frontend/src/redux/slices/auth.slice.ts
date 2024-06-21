import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

export interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null,
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    },
});

export default {
    reducer: slice.reducer,
    actions: slice.actions,
};