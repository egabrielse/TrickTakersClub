import { RootState } from "./store";

// Dialog Slice
export const selectDialogOpen = (state: RootState) => state.dialog.open;
export const selectDialogType = (state: RootState) => state.dialog.type;
