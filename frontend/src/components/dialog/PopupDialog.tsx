import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { DIALOG_TYPES } from "../../constants/dialog";
import dialogActions from "../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectDialogOpen, selectDialogPayload } from "../../redux/selectors";
import ErrorDialog from "./contents/ErrorDialog";
import LoginDialog from "./contents/LoginDialog";
import RegisterDialog from "./contents/RegisterDialog";
import ResetPassDialog from "./contents/ResetPassDialog";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectDialogOpen);
  const dialogPayload = useAppSelector(selectDialogPayload);

  const handleClose = () => {
    if (dialogPayload?.closeable !== false) {
      dispatch(dialogActions.closeDialog());
    }
  };

  const renderDialogContent = () => {
    if (!open || dialogPayload === undefined) return null;
    switch (dialogPayload?.type) {
      case DIALOG_TYPES.LOGIN:
        return <LoginDialog />;
      case DIALOG_TYPES.REGISTER:
        return <RegisterDialog />;
      case DIALOG_TYPES.RESET_PASSWORD:
        return <ResetPassDialog />;
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
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth="sm"
      component={"div"}
      closeAfterTransition
    >
      {renderDialogContent()}
    </Dialog>
  );
}
