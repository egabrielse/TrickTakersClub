import { DIALOG_TYPES } from "../constants/dialog";
import { HandSummary } from "./game";

export type DialogType = (typeof DIALOG_TYPES)[keyof typeof DIALOG_TYPES];

export interface BaseDialogParams {
    type: DialogType;
    closeable?: boolean;
    props?: object;
}

export interface GameSummaryDialogParams extends BaseDialogParams {
    type: typeof DIALOG_TYPES.GAME_SUMMARY;
    props: { summary: HandSummary };
}

export interface RegisterDialogParams extends BaseDialogParams {
    type: typeof DIALOG_TYPES.REGISTER;
}
export interface LoginDialogParams extends BaseDialogParams {
    type: typeof DIALOG_TYPES.LOGIN;
}

export interface ResetPasswordDialogParams extends BaseDialogParams {
    type: typeof DIALOG_TYPES.RESET;
}

export interface ErrorDialogParams extends BaseDialogParams {
    type: typeof DIALOG_TYPES.ERROR;
    props: { title: string; message: string };
}

export interface ConfirmExitDialogParams extends BaseDialogParams {
    type: typeof DIALOG_TYPES.CONFIRM_EXIT;
}

export type DialogParams =
    | RegisterDialogParams
    | LoginDialogParams
    | ResetPasswordDialogParams
    | ErrorDialogParams
    | ConfirmExitDialogParams
    | GameSummaryDialogParams;
