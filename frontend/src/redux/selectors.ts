import { RootState } from "./store";

// Auth Slice
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Dialog Slice
export const selectDialogOpen = (state: RootState) => state.dialog.open;
export const selectDialogPayload = (state: RootState) => state.dialog.payload;

// Table Slice
export const selectTableId = (state: RootState) => state.table.id;
export const selectTableHostId = (state: RootState) => state.table.hostId;
export const selectTableUsers = (state: RootState) => state.table.users;
export const selectTableLoading = (state: RootState) => state.table.loading;
export const selectTableError = (state: RootState) => state.table.error;