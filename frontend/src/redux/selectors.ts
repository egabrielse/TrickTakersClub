import { RootState } from "./store";

// Auth Slice
export const selectUserLoggedIn = (state: RootState) => state.auth.user !== null;
export const selectUser = (state: RootState) => state.auth.user;