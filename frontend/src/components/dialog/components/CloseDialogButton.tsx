import "./CloseDialogButton.scss";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "../../../redux/hooks";
import dialogSlice from "../../../redux/slices/dialog.slice";

export default function CloseDialogButton() {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(dialogSlice.actions.closeDialog());
  };

  return (
    <IconButton
      className="CloseDialogButton"
      aria-label="close"
      onClick={handleClose}
    >
      <CloseIcon />
    </IconButton>
  );
}
