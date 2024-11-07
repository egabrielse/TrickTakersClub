import { createReducer } from "@reduxjs/toolkit";
import tableActions from "./actions";

export interface TableState {
    id: string
    creatorId: string
    users: Record<string, boolean>
    loading?: boolean
    error?: string
}

const initialState: TableState = {
    id: "",
    creatorId: "",
    users: {}
};

const tableReducer = createReducer(initialState, (builder) => builder
    .addCase(tableActions.fetchTable.pending, (state) => {
        state.loading = true;
    })
    .addCase(tableActions.fetchTable.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.creatorId = action.payload.creatorId;
        state.users = action.payload.users;
        state.loading = false;
    })
    .addCase(tableActions.fetchTable.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
    })
    .addCase(tableActions.resetTable, () => initialState)
);

export default tableReducer;
