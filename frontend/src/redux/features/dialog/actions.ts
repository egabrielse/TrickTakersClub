import { createAction } from "@reduxjs/toolkit";
import { DialogType } from "../../../types/dialog";

export const DIALOG_ACTIONS = {
    OPEN_DIALOG: "dialog/openDialog",
    CLOSE_DIALOG: "dialog/closeDialog",
};

const dialogActions = {
    openDialog: createAction<DialogType>(DIALOG_ACTIONS.OPEN_DIALOG),
    closeDialog: createAction(DIALOG_ACTIONS.CLOSE_DIALOG),
};

export default dialogActions;