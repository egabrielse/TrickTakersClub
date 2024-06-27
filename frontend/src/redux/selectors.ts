import { RootState } from "./store";

// Auth Slice
export const selectUserLoggedIn = (state: RootState) =>
  state.auth.user !== null;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectUserError = (state: RootState) => state.auth.error;

// Dialog Slice
export const selectDialogOpen = (state: RootState) => state.dialog.open;
export const selectDialogType = (state: RootState) => state.dialog.type;
