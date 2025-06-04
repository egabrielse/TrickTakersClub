export const SEGMENTS = {
  ACCOUNT: "account",
  HOME: "",
  LOBBY: "lobby",
  RULES: "rules",
  TABLE: "table",
  LOGIN: "login",
  REGISTER: "register",
  RESET_PASSWORD: "reset-password",
} as const;

export const PATHS = {
  ROOT: "/",
  LOBBY: `/${SEGMENTS.LOBBY}`,
  SESSION: `/${SEGMENTS.LOBBY}/:sessionId`,
  ACCOUNT: `/${SEGMENTS.ACCOUNT}`,
  HOME: `/${SEGMENTS.HOME}`,
  RULES: `/${SEGMENTS.RULES}`,
  TABLE: `/${SEGMENTS.TABLE}/:tableId`,
  LOGIN: `/${SEGMENTS.LOGIN}`,
  REGISTER: `/${SEGMENTS.REGISTER}`,
  RESET_PASSWORD: `/${SEGMENTS.RESET_PASSWORD}`,
};
