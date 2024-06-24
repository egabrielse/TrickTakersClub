import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DialogType } from "../../types/dialog";

export interface DialogState {
    open: boolean;
    type: DialogType | undefined;
}

const initialState: DialogState = {
    open: false,
    type: undefined,
};

const slice = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        openDialog: (state, action: PayloadAction<DialogType>) => {
            if (state.open) return;
            state.open = true;
            state.type = action.payload;
        },
        closeDialog: (state) => {
            state.open = false;
            state.type = undefined;
        },
    },
});

export default {
    reducer: slice.reducer,
    actions: slice.actions,
};