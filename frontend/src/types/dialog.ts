import { DIALOG_TYPES } from "../constants/dialog";

export type DialogType = (typeof DIALOG_TYPES)[keyof typeof DIALOG_TYPES];
