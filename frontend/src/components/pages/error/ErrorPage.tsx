import { Button, Paper, Typography } from "@mui/material";
import { AxiosError, HttpStatusCode, isAxiosError } from "axios";
import { ReactNode } from "react";
import { ErrorResponse, isRouteErrorResponse } from "react-router";
import "./ErrorPage.scss";

type Action = {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
};

type ErrorPageProps = {
  error: Error | ErrorResponse | AxiosError | unknown;
  actions?: Action[];
};

export default function ErrorPage({
  error,
  actions = [],
}: ErrorPageProps): ReactNode {
  const getErrorTitle = () => {
    if (isRouteErrorResponse(error) || isAxiosError(error)) {
      if (error.status === HttpStatusCode.NotFound) {
        return "404 Not Found";
      }
    } else if (error instanceof Error) {
      return error.name;
    }
    return "Unexpected Error Occurred";
  };

  const getErrorDetails = () => {
    if (isRouteErrorResponse(error) || isAxiosError(error)) {
      if (error.status === HttpStatusCode.NotFound) {
        return "The page you are looking for does not exist.";
      }
    } else if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error occurred. Please try again later.";
  };

  return (
    <div className="ErrorPage">
      <Paper>
        <Typography variant="h3">{getErrorTitle()}</Typography>
        <Typography variant="body1">{getErrorDetails()}</Typography>
        {actions.map((action) => (
          <Button
            onClick={action.onClick}
            children={action.label}
            variant="outlined"
            color="primary"
            startIcon={action.icon}
          />
        ))}
      </Paper>
    </div>
  );
}
