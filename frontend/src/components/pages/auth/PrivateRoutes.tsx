import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import authSlice from "../../../store/slices/auth.slice";
import { useAppSelector } from "../../../store/store";
import { DialogContext } from "../../dialog/DialogProvider";
import LoadingPage from "../loading/LoadingPage";
import { AuthContext } from "./AuthContextProvider";

export default function PrivateRoutes() {
  const { openDialog } = useContext(DialogContext);
  const { initialized } = useContext(AuthContext);
  const isAuthenticated = useAppSelector(authSlice.selectors.isAuthenticated);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      openDialog({ type: DIALOG_TYPES.LOGIN });
    }
  }, [initialized, openDialog, isAuthenticated]);

  if (!initialized || !isAuthenticated) {
    return <LoadingPage />;
  } else {
    return <Outlet />;
  }
}
