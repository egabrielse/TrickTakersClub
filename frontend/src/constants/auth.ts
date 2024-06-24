export const VALIDATION_ERRORS = {
    EMAIL: {
        REQUIRED: 'Email is required',
        INVALID: 'Email is invalid',
    },
    PASSWORD: {
        REQUIRED: 'Password is required',
        MIN: 'Password must be at least 8 characters',
        MAX: 'Password must be at most 32 characters',
    },
    CONFIRM_PASSWORD: {
        REQUIRED: 'Confirm your password is correct',
        MATCH: 'Passwords must match',
    },
}