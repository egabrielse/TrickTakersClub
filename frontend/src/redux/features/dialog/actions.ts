import { createAction } from "@reduxjs/toolkit";
import { DialogPayload } from "../../../types/dialog";

export const DIALOG_ACTIONS = {
    OPEN_DIALOG: "dialog/OPEN_DIALOG",
    CLOSE_DIALOG: "dialog/CLOSE_DIALOG",
};

const dialogActions = {
    openDialog: createAction<DialogPayload>(DIALOG_ACTIONS.OPEN_DIALOG),
    closeDialog: createAction(DIALOG_ACTIONS.CLOSE_DIALOG),
};

export default dialogActions;