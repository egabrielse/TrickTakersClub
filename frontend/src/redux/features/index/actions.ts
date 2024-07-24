import { createAsyncThunk } from "@reduxjs/toolkit";
import { healthCheck } from "../../../api/index.api";

export const INDEX_ACTIONS = {
    HEALTH_CHECK: "index/HEALTH_CHECK",
};

const indexActions = {
    healthCheck: createAsyncThunk(
        INDEX_ACTIONS.HEALTH_CHECK,
        async () => {
            const data = await healthCheck();
            return data;
        },
    ),
};

export default indexActions;
