import { HttpStatusCode } from "axios";
import { ReactNode } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import ReturnHomeButton from "../common/ReturnHomeButton";
import Tile from "../common/Tile";
import "./RootErrorBoundary.scss";

export default function RootErrorBoundary(): ReactNode {
  const error = useRouteError();

  const getErrorTitle = () => {
    if (isRouteErrorResponse(error)) {
      if (error.status === HttpStatusCode.NotFound) {
        return "404 Not Found";
      }
    }
    return "Unexpected Error Occurred";
  };

  const getErrorDetails = () => {
    if (isRouteErrorResponse(error)) {
      if (error.status === HttpStatusCode.NotFound) {
        return "The page you are looking for does not exist.";
      }
    }
    return "An unexpected error occurred. Please try again later.";
  };

  return (
    <div className="RootErrorBoundary">
      <Tile>
        <h2>{getErrorTitle()}</h2>
        <p>{getErrorDetails()}</p>
        <br />
        <ReturnHomeButton />
      </Tile>
    </div>
  );
}
