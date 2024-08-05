import { useLocation, useNavigate } from "react-router";
import { PATHS } from "../../constants/url";
import AppLogo from "../common/AppLogo";
import AccountToolbar from "./AccountToolbar";
import "./AppHeader.scss";
import HeaderSection from "./HeaderSection";
import NavigationMenu from "./NavigationMenu";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnHome = () => {
    if (location.pathname !== PATHS.ROOT) {
      navigate(PATHS.ROOT);
    }
  };
  return (
    <div className="AppHeader">
      <HeaderSection>
        <AppLogo size="small" color="white" onClick={returnHome} />
        <NavigationMenu />
      </HeaderSection>
      <HeaderSection>
        <AccountToolbar />
      </HeaderSection>
    </div>
  );
}
