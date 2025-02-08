export const NAMED_SIZES = {
  XXLARGE: "xxlarge",
  XLARGE: "xlarge",
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
  XSMALL: "xsmall",
  XXSMALL: "xxsmall",
} as const;

export const SIZE_SCALE = {
  [NAMED_SIZES.XXLARGE]: 2,
  [NAMED_SIZES.XLARGE]: 1.5,
  [NAMED_SIZES.LARGE]: 1.25,
  [NAMED_SIZES.MEDIUM]: 1,
  [NAMED_SIZES.SMALL]: 0.75,
  [NAMED_SIZES.XSMALL]: 0.5,
  [NAMED_SIZES.XXSMALL]: 0.25,
} as const;
