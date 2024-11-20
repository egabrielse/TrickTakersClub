import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import LoadingPage from "../loading/LoadingPage";
import { AuthContext } from "../providers/AuthContextProvider";
import { DialogContext } from "../providers/DialogContextProvider";

export default function PrivateRoutes() {
  const { openDialog } = useContext(DialogContext);
  const { initialized, user } = useContext(AuthContext);

  useEffect(() => {
    if (initialized && user === null) {
      console.log("Opening login dialog");
      openDialog({ type: DIALOG_TYPES.LOGIN });
    }
  }, [initialized, user, openDialog]);

  if (!initialized || user === null) {
    return <LoadingPage />;
  } else {
    return <Outlet />;
  }
}
