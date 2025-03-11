import { useRouteError } from "react-router";
import ErrorPage from "./ErrorPage";

export default function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorPage error={error} />;
}
