import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import dialogSlice from '../../redux/slices/dialog.slice';
import { selectDialogOpen, selectDialogType } from '../../redux/selectors';
import LoginDialog from './contents/LoginDialog';
import RegisterDialog from './contents/RegisterDialog';
import { DIALOG_TYPES } from '../../constants/dialog';

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
      default:
        console.error(`Unknown dialog type: ${dialogType}`);
        return null;
    }
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      maxWidth="sm"
      component={'div'}
    >
      {renderDialogContent()}
    </Dialog>
  );
}
