export const SEGMENTS = {
  ACCOUNT: "account",
  HOME: "",
  RULES: "rules",
  TABLE: "table",
} as const;

export const PATHS = {
  ACCOUNT: `/${SEGMENTS.ACCOUNT}`,
  ROOT: "/",
  RULES: `/${SEGMENTS.RULES}`,
  TABLE: `/${SEGMENTS.TABLE}`,
};
