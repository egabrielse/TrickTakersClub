import { Middleware, configureStore } from '@reduxjs/toolkit';
import loggerMiddleware from './middleware/logger';
import gameSlice from './slices/game.slice';
import handSlice from './slices/hand.slice';
import authSlice from './slices/auth.slice';
import userSlice from './slices/user.slice';
import dialogSlice from './slices/dialog.slice';
import settingsSlice from './slices/settings.slice';
import sessionSlice from './slices/session.slice';

const additionalMiddleware: Middleware[] = [];

if (import.meta.env.DEV) {
    additionalMiddleware.push(loggerMiddleware);
}

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        dialog: dialogSlice.reducer,
        hand: handSlice.reducer,
        game: gameSlice.reducer,
        user: userSlice.reducer,
        session: sessionSlice.reducer,
        settings: settingsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(additionalMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;