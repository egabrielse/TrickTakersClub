import { Middleware, configureStore } from '@reduxjs/toolkit';
import loggerMiddleware from './middleware/logger';
import authSlice from './slices/auth.slice';

const additionalMiddleware: Middleware[] = [];

if (import.meta.env.DEV) {
  additionalMiddleware.push(loggerMiddleware);
}

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(additionalMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;