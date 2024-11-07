export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Incorrect email or password.",
  ALREADY_EXISTS: "An account with this email already exists.",
  DEFAULT: "An error occurred. Please try again later.",
};

export const VALIDATION_ERRORS = {
  DISPLAY_NAME: {
    REQUIRED: "Display name is required",
  },
  EMAIL: {
    REQUIRED: "Email is required",
    INVALID: "Email is invalid",
  },
  PASSWORD: {
    REQUIRED: "Password is required",
    MIN: "Password must be at least 8 characters",
    MAX: "Password must be at most 32 characters",
  },
  CONFIRM_PASSWORD: {
    REQUIRED: "Confirm your password is correct",
    MATCH: "Passwords must match",
  },
  TABLE_CODE: {
    REQUIRED: "Table code is required",
  },
};
