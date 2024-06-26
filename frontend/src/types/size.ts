import { NAMED_SIZES } from "../constants/size";

export type Size = typeof NAMED_SIZES[keyof typeof NAMED_SIZES];