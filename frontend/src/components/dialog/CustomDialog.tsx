import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { DIALOG_TYPES } from "../../constants/dialog";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectDialogOpen, selectDialogType } from "../../redux/selectors";
import dialogSlice from "../../redux/slices/dialog.slice";
import InitAccountDialog from "./contents/InitAccountDialog";
import LoginDialog from "./contents/LoginDialog";
import RegisterDialog from "./contents/RegisterDialog";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectDialogOpen);
  const dialogType = useAppSelector(selectDialogType);

  const handleClose = () => {
    dispatch(dialogSlice.actions.closeDialog());
  };

  const renderDialogContent = () => {
    if (!open) return null;
    switch (dialogType) {
      case DIALOG_TYPES.LOGIN:
        return <LoginDialog />;
      case DIALOG_TYPES.REGISTER:
        return <RegisterDialog />;
      case DIALOG_TYPES.INIT_ACCOUNT:
        return <InitAccountDialog />;
      default:
        console.error(`Unknown dialog type: ${dialogType}`);
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
