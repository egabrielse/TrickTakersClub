import { Middleware, configureStore } from "@reduxjs/toolkit";
import loggerMiddleware from "./middleware/logger";
import dialogReducer from "./features/dialog/reducer";
import authReducer from "./features/auth/reducer";
import tableReducer from "./features/table/reducer";


const additionalMiddleware: Middleware[] = [];

if (import.meta.env.DEV) {
  additionalMiddleware.push(loggerMiddleware);
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
    table: tableReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(additionalMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
