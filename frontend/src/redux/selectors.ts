import { RootState } from "./store";

// Auth Slice
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Dialog Slice
export const selectDialogOpen = (state: RootState) => state.dialog.open;
export const selectDialogPayload = (state: RootState) => state.dialog.payload;
