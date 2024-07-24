import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../constants/dialog";
import { PATHS } from "../../constants/url";
import dialogActions from "../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAuthUser } from "../../redux/selectors";

export default function PrivateRoutes() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    // Automatically redirect to home page if user is not logged in and show login dialog.
    if (user === null) {
      navigate(PATHS.ROOT);
      dispatch(dialogActions.openDialog(DIALOG_TYPES.LOGIN));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Otherwise, render the children.
  return <Outlet />;
}
