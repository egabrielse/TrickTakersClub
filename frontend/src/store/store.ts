import { Middleware, configureStore } from '@reduxjs/toolkit';
import loggerMiddleware from './middleware/logger';
import { useDispatch, useSelector } from 'react-redux';
import tableSlice from './slices/table.slice';
import gameSlice from './slices/game.slice';
import handSlice from './slices/hand.slice';
import authSlice from './slices/auth.slice';

const additionalMiddleware: Middleware[] = [];

if (import.meta.env.DEV) {
    additionalMiddleware.push(loggerMiddleware);
}

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        hand: handSlice.reducer,
        game: gameSlice.reducer,
        table: tableSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(additionalMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()