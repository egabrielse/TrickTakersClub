import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import dialogActions from "../../../redux/features/dialog/actions";
import { useAppDispatch } from "../../../redux/hooks";
import "./CloseDialogButton.scss";

export default function CloseDialogButton() {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(dialogActions.closeDialog());
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
