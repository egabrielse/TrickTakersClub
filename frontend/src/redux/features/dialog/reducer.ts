import { createReducer } from "@reduxjs/toolkit";
import dialogActions, { DialogPayload } from "./actions";

export interface DialogState {
    open: boolean;
    payload?: DialogPayload;
}

// TODO: add logic to redirect after successful login
const initialState: DialogState = {
    open: false,
    payload: undefined,
};

const dialogReducer = createReducer(initialState, (builder) => builder
    .addCase(dialogActions.openDialog, (state, action) => {
        if (state.open) return;
        state.open = true;
        state.payload = action.payload;
    })
    .addCase(dialogActions.closeDialog, (state) => {
        state.open = false;
        state.payload = undefined;
    })
);

export default dialogReducer;
