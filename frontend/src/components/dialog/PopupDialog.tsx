import Dialog from "@mui/material/Dialog";
import { DIALOG_TYPES } from "../../constants/dialog";
import dialogActions from "../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectDialogOpen, selectDialogPayload } from "../../redux/selectors";
import SlideTransition from "../common/SlideTransition";
import ErrorDialog from "./contents/ErrorDialog";
import LoginDialog from "./contents/LoginDialog";
import RegisterDialog from "./contents/RegisterDialog";
import ResetPasswordDialog from "./contents/ResetPasswordDialog";

export default function PopupDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectDialogOpen);
  const dialogPayload = useAppSelector(selectDialogPayload);

  const handleClose = () => {
    dispatch(dialogActions.closeDialog());
  };

  const renderDialogContent = () => {
    if (!open || dialogPayload === undefined) return null;
    switch (dialogPayload?.type) {
      case DIALOG_TYPES.LOGIN:
        return <LoginDialog />;
      case DIALOG_TYPES.REGISTER:
        return <RegisterDialog />;
      case DIALOG_TYPES.RESET:
        return <ResetPasswordDialog />;
      case DIALOG_TYPES.ERROR:
        return <ErrorDialog {...dialogPayload.props} />;
      default:
        console.error("Unknown dialog payload", dialogPayload);
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={SlideTransition}
      keepMounted
      onClose={dialogPayload?.closeable ? handleClose : undefined}
      maxWidth="sm"
      component={"div"}
      closeAfterTransition
    >
      {renderDialogContent()}
    </Dialog>
  );
}
