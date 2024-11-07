import { HttpStatusCode } from "axios";
import { ReactNode, useCallback, useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import dialogActions from "../../../redux/features/dialog/actions";
import { useAppDispatch } from "../../../redux/hooks";
import PopupDialog from "../../dialog/PopupDialog";
import "./RootErrorBoundary.scss";

export default function RootErrorBoundary(): ReactNode {
  const error = useRouteError();
  const dispatch = useAppDispatch();

  const getErrorTitle = useCallback(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status === HttpStatusCode.NotFound) {
        return "404 Not Found";
      }
    }
    return "Unexpected Error Occurred";
  }, [error]);

  const getErrorDetails = useCallback(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status === HttpStatusCode.NotFound) {
        return "The page you are looking for does not exist.";
      }
    }
    return "An unexpected error occurred. Please try again later.";
  }, [error]);

  useEffect(() => {
    dispatch(
      dialogActions.openDialog({
        type: DIALOG_TYPES.ERROR,
        closeable: false,
        props: { title: getErrorTitle(), message: getErrorDetails() },
      }),
    );
  }, [dispatch, error, getErrorDetails, getErrorTitle]);

  return (
    <div className="RootErrorBoundary">
      <PopupDialog />
    </div>
  );
}
