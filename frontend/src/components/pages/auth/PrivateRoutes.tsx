import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import dialogActions from "../../../redux/features/dialog/actions";
import { useAppDispatch } from "../../../redux/hooks";
import LoadingPage from "../loading/LoadingPage";
import { AuthContext } from "./AuthContextProvider";

export default function PrivateRoutes() {
  const dispatch = useAppDispatch();
  const { initialized, user } = useContext(AuthContext);

  useEffect(() => {
    if (initialized && user === null) {
      dispatch(dialogActions.openDialog({ type: DIALOG_TYPES.LOGIN }));
    }
    return () => {
      if (user !== null) {
        dispatch(dialogActions.closeDialog());
      }
    };
  }, [dispatch, initialized, user]);

  if (!initialized || user === null) {
    return <LoadingPage />;
  } else {
    return <Outlet />;
  }
}
