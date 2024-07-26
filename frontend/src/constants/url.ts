export const SEGMENTS = {
  ACCOUNT: "account",
  HOME: "",
  RULES: "rules",
  TABLE: "table",
} as const;

export const PATHS = {
  ROOT: "/",
  ACCOUNT: `/${SEGMENTS.ACCOUNT}`,
  HOME: `/${SEGMENTS.HOME}`,
  RULES: `/${SEGMENTS.RULES}`,
  TABLE: `/${SEGMENTS.TABLE}/:tableId`,
};
