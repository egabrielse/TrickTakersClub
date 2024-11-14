import { createReducer } from "@reduxjs/toolkit";
import tableActions from "./actions";
import { CONNECTION_STATUS } from "../../../constants/connection";
import { ConnectionStatus } from "../../../types/connection";

export interface TableState {
    id: string
    hostId: string
    loading: boolean
    error?: string
    status: ConnectionStatus
}

const initialState: TableState = {
    id: "",
    hostId: "",
    loading: true,
    status: CONNECTION_STATUS.DISCONNECTED,

};

const tableReducer = createReducer(initialState, (builder) => builder
    .addCase(tableActions.fetchTable.pending, (state) => {
        state.loading = true;
    })
    .addCase(tableActions.fetchTable.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.hostId = action.payload.hostId;
        state.loading = false;
    })
    .addCase(tableActions.fetchTable.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
    })
    .addCase(tableActions.resetTable, () => initialState)
);

export default tableReducer;
