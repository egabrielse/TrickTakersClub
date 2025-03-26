import { Dialog } from "@mui/material";
import { ReactNode, useCallback, useEffect } from "react";
import { DIALOG_TYPES } from "../../constants/dialog";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import dialogSlice from "../../store/slices/dialog.slice";
import { DialogParams } from "../../types/dialog";
import SlideTransition from "../common/SlideTransition";
import ConfirmExitDialog from "./contents/ConfirmExitDialog";
import ErrorDialog from "./contents/ErrorDialog";
import GameSummaryDialog from "./contents/GameSummaryDialog";
import HandSummaryDialog from "./contents/HandSummaryDialog";

type DialogProviderProps = {
  children: ReactNode;
};

export default function DialogProvider({ children }: DialogProviderProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(dialogSlice.selectors.isOpen);
  const dialogs = useAppSelector(dialogSlice.selectors.dialogs);

  const renderDialogContent = (dialog: DialogParams) => {
    if (!isOpen || dialog === null) return null;
    switch (dialog?.type) {
      case DIALOG_TYPES.ERROR:
        return <ErrorDialog {...dialog} />;
      case DIALOG_TYPES.CONFIRM_EXIT:
        return <ConfirmExitDialog {...dialog} />;
      case DIALOG_TYPES.HAND_SUMMARY:
        return <HandSummaryDialog {...dialog} />;
      case DIALOG_TYPES.GAME_SUMMARY:
        return <GameSummaryDialog {...dialog} />;
      default:
        console.error("Unknown dialog parameters", dialog);
        return null;
    }
  };

  const resetDialogs = useCallback(() => {
    dispatch(dialogSlice.actions.reset());
  }, [dispatch]);

  const closeDialog = useCallback(() => {
    dispatch(dialogSlice.actions.closeDialog());
  }, [dispatch]);

  useEffect(() => {
    // Close dialog when user navigates back
    window.addEventListener("popstate", resetDialogs);
    return () => {
      window.removeEventListener("popstate", resetDialogs);
    };
  }, [resetDialogs]);

  return (
    <>
      {dialogs.map((dialog, index) => (
        <Dialog
          key={`${dialog.type}-${index}`}
          closeAfterTransition
          component={"div"}
          keepMounted
          onClose={dialog?.closeable ? closeDialog : undefined}
          open={isOpen}
          slots={{ transition: SlideTransition }}
          maxWidth="md"
        >
          {renderDialogContent(dialog)}
        </Dialog>
      ))}
      {children}
    </>
  );
}
