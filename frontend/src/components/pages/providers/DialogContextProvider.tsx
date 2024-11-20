import { Dialog } from "@mui/material";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { DialogParams } from "../../../types/dialog";
import SlideTransition from "../../common/SlideTransition";
import ErrorDialog from "../../dialog/contents/ErrorDialog";
import LoginDialog from "../../dialog/contents/LoginDialog";
import RegisterDialog from "../../dialog/contents/RegisterDialog";
import ResetPassDialog from "../../dialog/contents/ResetPasswordDialog";

type DialogContextProviderProps = {
  children: ReactNode;
};

export const DialogContext = createContext<{
  isOpen: boolean;
  params: DialogParams | null;
  openDialog: (params: DialogParams) => void;
  closeDialog: () => void;
}>({
  isOpen: false,
  params: null,
  openDialog: () => {},
  closeDialog: () => {},
});

export default function DialogContextProvider({
  children,
}: DialogContextProviderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [params, setParams] = useState<DialogParams | null>(null);

  const openDialog = useCallback((params: DialogParams) => {
    setParams(params);
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setParams(null);
    setIsOpen(false);
  }, []);

  const renderDialogContent = () => {
    if (!isOpen || params === null) return null;
    switch (params?.type) {
      case DIALOG_TYPES.LOGIN:
        return <LoginDialog />;
      case DIALOG_TYPES.REGISTER:
        return <RegisterDialog />;
      case DIALOG_TYPES.RESET:
        return <ResetPassDialog />;
      case DIALOG_TYPES.ERROR:
        return <ErrorDialog {...params.props} />;
      default:
        console.error("Unknown dialog parameters", params);
        return null;
    }
  };

  // useEffect(() => {
  //   closeDialog();
  // }, [location]);

  useEffect(() => {
    // Close dialog when user navigates back
    window.addEventListener("popstate", closeDialog);
    return () => {
      window.removeEventListener("popstate", closeDialog);
    };
  }, [closeDialog]);

  return (
    <DialogContext.Provider value={{ isOpen, params, openDialog, closeDialog }}>
      <Dialog
        closeAfterTransition
        component={"div"}
        keepMounted
        onClose={params?.closeable ? closeDialog : undefined}
        open={isOpen}
        TransitionComponent={SlideTransition}
      >
        {renderDialogContent()}
      </Dialog>
      {children}
    </DialogContext.Provider>
  );
}
