export const SEGMENTS = {
  APP: "app",
  ACCOUNT: "account",
  LEADERBOARD: "leaderboard",
  RULES: "rules",
  ABOUT: "about",
  TABLE: "table",
} as const;

export const PATHS = {
  ROOT: "/",
  TABLE: `/${SEGMENTS.TABLE}`,
  APP: `/${SEGMENTS.APP}`,
  HOME: `/${SEGMENTS.APP}`, // Index of the APP
  ACCOUNT: `/${SEGMENTS.APP}/${SEGMENTS.ACCOUNT}`,
  LEADERBOARD: `/${SEGMENTS.APP}/${SEGMENTS.LEADERBOARD}`,
  RULES: `/${SEGMENTS.APP}/${SEGMENTS.RULES}`,
  ABOUT: `/${SEGMENTS.APP}/${SEGMENTS.ABOUT}`,
};
