import { ReactNode, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { PATHS } from "../../constants/url";
import HeaderBar from "./HeaderBar/HeaderBar";
import "./HeaderLayout.scss";

export default function HeaderLayout(): ReactNode {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case PATHS.HOME:
        document.title = "Trick Takers Club";
        break;
      case PATHS.ACCOUNT:
        document.title = "Account";

        break;
      case PATHS.RULES:
        document.title = "Rules";
        break;
      default:
        break;
    }
  }, [location.pathname]);

  return (
    <div className="HeaderLayout">
      <HeaderBar />
      <div className="HeaderLayout-Content">
        <Outlet />
      </div>
    </div>
  );
}
