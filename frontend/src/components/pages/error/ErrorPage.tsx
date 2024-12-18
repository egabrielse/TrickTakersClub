import { Paper, Typography } from "@mui/material";
import { AxiosError, HttpStatusCode, isAxiosError } from "axios";
import { ReactNode } from "react";
import { ErrorResponse, isRouteErrorResponse } from "react-router";
import "./ErrorPage.scss";

type ErrorPageProps = {
  error: Error | ErrorResponse | AxiosError | unknown;
};

export default function ErrorPage({ error }: ErrorPageProps): ReactNode {
  const getErrorTitle = () => {
    if (isRouteErrorResponse(error) || isAxiosError(error)) {
      if (error.status === HttpStatusCode.NotFound) {
        return "404 Not Found";
      }
    } else if (error instanceof Error) {
      return "Unexpected Error Occurred";
    }
    return "Unexpected Error Occurred";
  };

  const getErrorDetails = () => {
    if (isRouteErrorResponse(error) || isAxiosError(error)) {
      if (error.status === HttpStatusCode.NotFound) {
        return "The page you are looking for does not exist.";
      }
    } else if (error instanceof Error) {
      return "An unexpected error occurred. Please try again later.";
    }
    return "An unexpected error occurred. Please try again later.";
  };

  return (
    <div className="ErrorPage">
      <Paper>
        <Typography variant="h3">{getErrorTitle()}</Typography>
        <Typography variant="body1">{getErrorDetails()}</Typography>
      </Paper>
    </div>
  );
}
