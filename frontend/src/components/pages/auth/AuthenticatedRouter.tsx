import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { PATHS } from "../../../constants/url";
import { useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import LoadingOverlay from "../loading/LoadingOverlay";
import AuthContext from "./AuthContext";

export default function AuthenticatedRouter() {
  const navigate = useNavigate();
  const { initialized } = useContext(AuthContext);
  const isAuthenticated = useAppSelector(authSlice.selectors.isAuthenticated);

  useEffect(() => {
    if (initialized && isAuthenticated) {
      navigate(PATHS.HOME);
    }
  }, [navigate, initialized, isAuthenticated]);

  if (!initialized) {
    return <LoadingOverlay text="Loading" trailingEllipsis />;
  } else if (isAuthenticated) {
    return <LoadingOverlay />;
  } else {
    return <Outlet />;
  }
}
