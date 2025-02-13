import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useCallback } from "react";
import { useAppDispatch } from "../../../store/hooks";
import dialogSlice from "../../../store/slices/dialog.slice";
import "./CloseDialogButton.scss";

export default function CloseDialogButton() {
  const dispatch = useAppDispatch();

  const closeDialog = useCallback(() => {
    dispatch(dialogSlice.actions.closeDialog());
  }, [dispatch]);

  return (
    <IconButton
      className="CloseDialogButton"
      aria-label="close"
      onClick={closeDialog}
    >
      <CloseIcon />
    </IconButton>
  );
}
