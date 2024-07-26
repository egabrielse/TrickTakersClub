import { createAction } from "@reduxjs/toolkit";
import { DialogType } from "../../../types/dialog";
import { DIALOG_TYPES } from "../../../constants/dialog";

export const DIALOG_ACTIONS = {
    OPEN_DIALOG: "dialog/OPEN_DIALOG",
    CLOSE_DIALOG: "dialog/CLOSE_DIALOG",
};

export interface GenericDialogPayload {
    type: DialogType;
    closeable?: boolean;
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

const dialogActions = {
    openDialog: createAction<DialogPayload>(DIALOG_ACTIONS.OPEN_DIALOG),
    closeDialog: createAction(DIALOG_ACTIONS.CLOSE_DIALOG),
};

export default dialogActions;