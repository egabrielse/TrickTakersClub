import { DIALOG_TYPES } from "../constants/dialog";

export type DialogType = (typeof DIALOG_TYPES)[keyof typeof DIALOG_TYPES];

export interface GenericDialogPayload {
    type: DialogType;
    props?: object;
}

export interface RegisterDialogPayload extends GenericDialogPayload {
    type: typeof DIALOG_TYPES.REGISTER;
}
export interface LoginDialogPayload extends GenericDialogPayload {
    type: typeof DIALOG_TYPES.LOGIN;
}

export interface ResetPasswordPayload extends GenericDialogPayload {
    type: typeof DIALOG_TYPES.RESET_PASSWORD;
}

export interface ErrorPayload extends GenericDialogPayload {
    type: typeof DIALOG_TYPES.ERROR;
    props: { title: string; message: string };
}

export type DialogPayload = RegisterDialogPayload | LoginDialogPayload | ResetPasswordPayload | ErrorPayload;