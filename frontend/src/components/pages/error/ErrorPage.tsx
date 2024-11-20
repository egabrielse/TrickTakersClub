import { HttpStatusCode } from "axios";
import { ReactNode, useCallback, useContext, useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import PopupDialog from "../../dialog/PopupDialog";
import { DialogContext } from "../providers/DialogContextProvider";
import "./ErrorPage.scss";

export default function ErrorPage(): ReactNode {
  const error = useRouteError();
  const { openDialog } = useContext(DialogContext);

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
    openDialog({
      type: DIALOG_TYPES.ERROR,
      closeable: false,
      props: { title: getErrorTitle(), message: getErrorDetails() },
    });
  }, [error, getErrorDetails, getErrorTitle, openDialog]);

  return (
    <div className="ErrorPage">
      <PopupDialog />
    </div>
  );
}
