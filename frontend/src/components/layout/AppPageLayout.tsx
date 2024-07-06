import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import RuleIcon from "@mui/icons-material/Rule";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Outlet, useLocation, useNavigate } from "react-router";
import { PATHS } from "../../constants/url";
import "./AppPageLayout.scss";

export default function AppPageLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (newPath: string) => {
    if (newPath === location.pathname) return;
    navigate(newPath);
  };

  return (
    <div className="AppPageLayout">
      <Tabs
        className="AppPageLayout-NavBar"
        value={location.pathname}
        orientation="vertical"
      >
        <Tab
          key={PATHS.HOME}
          value={PATHS.HOME}
          icon={<HomeIcon />}
          label="Home"
          onClick={() => handleChange(PATHS.HOME)}
        />
        <Tab
          key={PATHS.LEADERBOARD}
          value={PATHS.LEADERBOARD}
          icon={<LeaderboardIcon />}
          label="Leaderboard"
          onClick={() => handleChange(PATHS.LEADERBOARD)}
        />
        <Tab
          key={PATHS.RULES}
          value={PATHS.RULES}
          icon={<RuleIcon />}
          label="Rules"
          onClick={() => handleChange(PATHS.RULES)}
        />
        <Tab
          key={PATHS.ACCOUNT}
          value={PATHS.ACCOUNT}
          icon={<ManageAccountsIcon />}
          label="Account"
          onClick={() => handleChange(PATHS.ACCOUNT)}
        />
      </Tabs>
      <div className="AppPageLayout-PageContent">
        <Outlet />
      </div>
    </div>
  );
}
