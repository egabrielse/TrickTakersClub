export const SEGMENTS = {
  ABOUT: "about",
  ACCOUNT: "account",
  HOME: "",
  LEADERBOARD: "leaderboard",
  RULES: "rules",
  TABLE: "table",

} as const;

export const PATHS = {
  ROOT: "/",
  ABOUT: `/${SEGMENTS.ABOUT}`,
  ACCOUNT: `/${SEGMENTS.ACCOUNT}`,
  HOME: `/${SEGMENTS.HOME}`,
  LEADERBOARD: `/${SEGMENTS.LEADERBOARD}`,
  RULES: `/${SEGMENTS.RULES}`,
  TABLE: `/${SEGMENTS.TABLE}/:tableId`,
};
