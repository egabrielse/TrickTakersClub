import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { PATHS } from "../../../constants/url";
import { useAppDispatch } from "../../../store/hooks";
import dialogSlice from "../../../store/slices/dialog.slice";
import { ConfirmExitDialogParams } from "../../../types/dialog";
import CloseDialogButton from "../components/CloseDialogButton";
import DialogBody from "../components/DialogBody";
import DialogFooter from "../components/DialogFooter";
import DialogHeader from "../components/DialogHeader";

export default function ConfirmExitDialog({
  closeable,
}: ConfirmExitDialogParams) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleReturnHome = () => {
    dispatch(dialogSlice.actions.closeDialog());
    navigate(PATHS.ROOT);
  };

  const handleCancel = () => {
    dispatch(dialogSlice.actions.closeDialog());
  };

  return (
    <>
      {closeable && <CloseDialogButton />}
      <DialogHeader>
        <h2>Game in Progress</h2>
      </DialogHeader>
      <DialogBody>
        <p>
          You're currently in the middle of a game. Are you sure you want to
          leave?
        </p>
      </DialogBody>
      <DialogFooter>
        <Button
          onClick={handleReturnHome}
          children="Confirm"
          variant="contained"
          color="primary"
        />
        <Button
          onClick={handleCancel}
          children="Cancel"
          variant="outlined"
          color="primary"
        />
      </DialogFooter>
    </>
  );
}
