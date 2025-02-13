import { createSlice } from "@reduxjs/toolkit";
import { DialogParams } from "../../types/dialog";


interface DialogState {
    dialogs: DialogParams[];
}

const initialState: DialogState = {
    dialogs: []
};


const dialogSlice = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        reset: () => initialState,
        openDialog: (state, action) => {
            state.dialogs.push(action.payload);
        },
        closeDialog: (state) => {
            state.dialogs.pop();
        }
    },
    selectors: {
        isOpen: (state: DialogState) => state.dialogs.length > 0,
        dialogs: (state: DialogState) => state.dialogs,
    }
});

export default dialogSlice;
