import { createReducer } from "@reduxjs/toolkit";
import { DialogType } from "../../../types/dialog";
import dialogActions from "./actions";

export interface DialogState {
    open: boolean;
    type: DialogType | undefined;
}

// TODO: add logic to redirect after successful login
const initialState: DialogState = {
    open: false,
    type: undefined,
};

const dialogReducer = createReducer(initialState, (builder) => builder
    .addCase(dialogActions.openDialog, (state, action) => {
        if (state.open) return;
        state.open = true;
        state.type = action.payload;
    })
    .addCase(dialogActions.closeDialog, (state) => {
        state.open = false;
        state.type = undefined;
    })
);

export default dialogReducer;
