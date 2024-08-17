import { createReducer } from "@reduxjs/toolkit";
import { User } from "../../../types/user";
import authActions from "./actions";
import { getErrorForDisplay } from "../../../utils/error";
export interface AuthState {
    user: User | null;
    error?: string;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: true,
};

const authReducer = createReducer(initialState, (builder) => builder
    .addCase(authActions.login.pending, (state) => {
        state.loading = true;
    })
    .addCase(authActions.login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
    })
    .addCase(authActions.login.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorForDisplay(action.error)
    })
    .addCase(authActions.signUp.pending, (state) => {
        state.loading = true;
    })
    .addCase(authActions.signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
    })
    .addCase(authActions.signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorForDisplay(action.error)
    })
    .addCase(authActions.initializeUser, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
    })
    .addCase(authActions.logout.pending, (state) => {
        state.loading = true;
    })
    .addCase(authActions.logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
    })
    .addCase(authActions.logout.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorForDisplay(action.error)
    })
);

export default authReducer;
