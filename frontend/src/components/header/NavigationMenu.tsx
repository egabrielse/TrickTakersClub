import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { Tab, Tabs } from "@mui/material";
import { SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { PATHS } from "../../constants/url";
import "./NavigationMenu.scss";

export default function NavigationMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigateTo = (_: SyntheticEvent, path: string) => {
    console.log("navigateTo", path);
    console.log("location.pathname", location.pathname);
    if (currentPath !== path) {
      navigate(path);
    }
  };

  return (
    <Tabs
      value={location.pathname}
      onChange={navigateTo}
      className="NavigationMenu"
      textColor="inherit"
    >
      <Tab
        value={PATHS.HOME}
        iconPosition="start"
        icon={<HomeIcon fontSize="small" />}
        label="Home"
      />
      <Tab
        value={PATHS.RULES}
        iconPosition="start"
        icon={<FormatListNumberedIcon fontSize="small" />}
        label="Rules"
      />
      <Tab
        value={PATHS.LEADERBOARD}
        iconPosition="start"
        icon={<LeaderboardIcon fontSize="small" />}
        label="Leaderboard"
      />
      <Tab
        value={PATHS.ABOUT}
        iconPosition="start"
        icon={<InfoIcon fontSize="small" />}
        label="About"
      />
    </Tabs>
  );
}
