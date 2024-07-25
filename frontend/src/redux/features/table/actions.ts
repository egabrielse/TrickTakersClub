import { createAsyncThunk } from "@reduxjs/toolkit";
import { createTable } from "../../../api/table.api";

export const TABLE_ACTIONS = {
    CREATE_TABLE: "index/CREATE_TABLE",
};

const tableActions = {
    createTable: createAsyncThunk(
        TABLE_ACTIONS.CREATE_TABLE,
        async () => {
            const data = await createTable();
            return data;
        },
    ),
};

export default tableActions;
