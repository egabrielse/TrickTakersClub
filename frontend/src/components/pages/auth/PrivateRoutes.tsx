import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { DialogContext } from "../../dialog/DialogProvider";
import LoadingPage from "../loading/LoadingPage";
import { AuthContext } from "./AuthProvider";

export default function PrivateRoutes() {
  const { openDialog } = useContext(DialogContext);
  const { initialized, user } = useContext(AuthContext);

  useEffect(() => {
    if (initialized && user === null) {
      openDialog({ type: DIALOG_TYPES.LOGIN });
    }
  }, [initialized, user, openDialog]);

  if (!initialized || user === null) {
    return <LoadingPage />;
  } else {
    return <Outlet />;
  }
}
