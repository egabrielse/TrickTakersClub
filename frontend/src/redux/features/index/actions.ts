import { createAsyncThunk } from "@reduxjs/toolkit";
import { healthCheck } from "../../../api/index.api";

export const TABLE_ACTIONS = {
    CREATE_TABLE: "table/createTable",
};

const indexActions = {
    healthCheck: createAsyncThunk(
        TABLE_ACTIONS.CREATE_TABLE,
        async () => {
            const data = await healthCheck();
            return data;
        },
    ),
};

export default indexActions;
