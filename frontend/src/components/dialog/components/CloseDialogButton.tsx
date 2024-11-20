import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useContext } from "react";
import { DialogContext } from "../../providers/DialogProvider";
import "./CloseDialogButton.scss";

export default function CloseDialogButton() {
  const { closeDialog } = useContext(DialogContext);

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
