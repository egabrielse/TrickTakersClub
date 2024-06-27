import { SIZE_SCALE } from "../constants/size";
import { Size } from "../types/size";

/**
 * Helper function to scale a base value by a size.
 */
export const scaleBySize = (size: Size, base: number) => {
  return base * SIZE_SCALE[size];
};

export const getAppNameFontSize = (size: Size) => {
  return scaleBySize(size, 24);
};
