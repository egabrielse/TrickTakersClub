import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../constants/dialog";
import { PATHS } from "../../constants/url";
import dialogActions from "../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAuthLoading, selectAuthUser } from "../../redux/selectors";
import LoadingPage from "./loading/LoadingPage";

export default function PrivateRoutes() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const loading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    // Automatically redirect to home page if user is not logged in and show login dialog.
    if (user === null && !loading) {
      navigate(PATHS.ROOT);
      dispatch(dialogActions.openDialog({ type: DIALOG_TYPES.LOGIN }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Otherwise, render the children.
  return loading ? <LoadingPage /> : <Outlet />;
}
