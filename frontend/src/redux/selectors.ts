import { RootState } from "./store";

// Dialog Slice
export const selectDialogOpen = (state: RootState) => state.dialog.open;
export const selectDialogPayload = (state: RootState) => state.dialog.payload;

// Table Slice
export const selectTableId = (state: RootState) => state.table.id;
export const selectTableHostId = (state: RootState) => state.table.hostId;
export const selectTableLoading = (state: RootState) => state.table.loading;
export const selectTableError = (state: RootState) => state.table.error;