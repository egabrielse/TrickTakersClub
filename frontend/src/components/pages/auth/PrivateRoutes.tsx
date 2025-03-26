import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { PATHS } from "../../../constants/url";
import { useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import LoadingOverlay from "../loading/LoadingOverlay";
import AuthContext from "./AuthContext";

export default function PrivateRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialized } = useContext(AuthContext);
  const isAuthenticated = useAppSelector(authSlice.selectors.isAuthenticated);

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      navigate(PATHS.LOGIN, {
        replace: true,
        state: { redirectPath: location.pathname },
      });
    }
  }, [navigate, initialized, isAuthenticated, location.pathname]);

  if (!initialized) {
    return <LoadingOverlay text="Loading" trailingEllipsis />;
  } else if (!isAuthenticated) {
    return <LoadingOverlay />;
  } else {
    return <Outlet />;
  }
}
