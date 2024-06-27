import { HttpStatusCode } from "axios";
import { ReactNode } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import ErrorDialog from "../common/ErrorDialog";
import "./RootErrorBoundary.scss";

export default function RootErrorBoundary(): ReactNode {
  const error = useRouteError();

  return (
    <div className="RootErrorBoundary">
      {isRouteErrorResponse(error) &&
      error.status === HttpStatusCode.NotFound ? (
        <ErrorDialog
          title="Page Not Found"
          details="Looks like you might be lost. Let's get you back home!"
          srcImage="/error/not-found.svg"
        />
      ) : (
        <ErrorDialog
          title="Unexpected Error Occurred"
          details={
            <>
              An unexpected application error has occurred.
              <br />
              Let's get you to safety!
            </>
          }
          srcImage="/error/unexpected.svg"
        />
      )}
    </div>
  );
}
