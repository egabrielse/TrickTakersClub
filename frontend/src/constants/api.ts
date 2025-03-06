export const FETCH_STATUS = {
    LOADING: 'loading',
    LOADED: 'loaded',
    ERROR: 'error',
} as const;

export const ASYNC_STATUS = {
    IDLE: 'idle',
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
} as const;