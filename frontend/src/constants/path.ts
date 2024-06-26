export const SEGMENTS = {
    APP: 'app',
    PROFILE: 'profile',
    LEADERBOARD: 'leaderboard',
    RULES: 'rules',
    ABOUT: 'about',
    TABLE: 'table',
} as const;

export const PATHS = {
    ROOT: '/',
    TABLE: `/${SEGMENTS.TABLE}`,
    APP: `/${SEGMENTS.APP}`,
    HOME: `/${SEGMENTS.APP}`, // Index of the APP
    PROFILE: `/${SEGMENTS.APP}/${SEGMENTS.PROFILE}`,
    LEADERBOARD: `/${SEGMENTS.APP}/${SEGMENTS.LEADERBOARD}`,
    RULES: `/${SEGMENTS.APP}/${SEGMENTS.RULES}`,
    ABOUT: `/${SEGMENTS.APP}/${SEGMENTS.ABOUT}`,
};