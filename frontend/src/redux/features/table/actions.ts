import { createAsyncThunk } from "@reduxjs/toolkit";
import { createTable, fetchTable } from "../../../api/table.api";

export const TABLE_ACTIONS = {
    CREATE_TABLE: "index/CREATE_TABLE",
    FETCH_TABLE: "index/FETCH_TABLE",
};

const tableActions = {
    createTable: createAsyncThunk(
        TABLE_ACTIONS.CREATE_TABLE,
        async () => {
            const data = await createTable();
            return data;
        },
    ),
    fetchTable: createAsyncThunk(
        TABLE_ACTIONS.FETCH_TABLE,
        async (tableId: string) => {
            const data = await fetchTable(tableId);
            return data;
        },
    )
};

export default tableActions;
