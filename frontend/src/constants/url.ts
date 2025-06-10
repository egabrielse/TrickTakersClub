export const SEGMENTS = {
  ACCOUNT: "account",
  HOME: "",
  SESSION: "session",
  BROWSER: "browser",
  RULES: "rules",
  LOGIN: "login",
  REGISTER: "register",
  RESET_PASSWORD: "reset-password",
} as const;

export const PATHS = {
  ROOT: "/",
  BROWSER: `/${SEGMENTS.BROWSER}`,
  SESSION: `/${SEGMENTS.SESSION}/:sessionId`,
  ACCOUNT: `/${SEGMENTS.ACCOUNT}`,
  HOME: `/${SEGMENTS.HOME}`,
  RULES: `/${SEGMENTS.RULES}`,
  LOGIN: `/${SEGMENTS.LOGIN}`,
  REGISTER: `/${SEGMENTS.REGISTER}`,
  RESET_PASSWORD: `/${SEGMENTS.RESET_PASSWORD}`,
};
