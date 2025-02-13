import { useContext, useEffect } from "react";
import { Outlet } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import dialogSlice from "../../../store/slices/dialog.slice";
import LoadingPage from "../loading/LoadingPage";
import { AuthContext } from "./AuthContextProvider";

export default function PrivateRoutes() {
  const dispatch = useAppDispatch();
  const { initialized } = useContext(AuthContext);
  const isAuthenticated = useAppSelector(authSlice.selectors.isAuthenticated);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      dispatch(dialogSlice.actions.openDialog({ type: DIALOG_TYPES.LOGIN }));
    }
  }, [dispatch, initialized, isAuthenticated]);

  if (!initialized || !isAuthenticated) {
    return <LoadingPage />;
  } else {
    return <Outlet />;
  }
}
