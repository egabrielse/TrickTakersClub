import './AppPageLayout.scss';
import { Outlet, useLocation, useNavigate } from "react-router";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { PATHS } from "../../constants/path";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import RuleIcon from "@mui/icons-material/Rule";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";

export default function AppPageLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (newPath: string) => {
    if (newPath === location.pathname) return;
    navigate(newPath);
  }
    
  return (
    <div className='AppPageLayout'>
      <Tabs className="AppPageLayout-NavBar" value={location.pathname} orientation="vertical">
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
          key={PATHS.PROFILE}
          value={PATHS.PROFILE}
          icon={<PersonIcon />}
          label="Profile"
          onClick={() => handleChange(PATHS.PROFILE)}
        />
        <Tab
          key={PATHS.ABOUT}
          value={PATHS.ABOUT}
          icon={<InfoIcon />}
          label="About"
          onClick={() => handleChange(PATHS.ABOUT)}
        />
      </Tabs>
      <div className='AppPageLayout-PageContent'>
        <Outlet />
      </div>
    </div>
  )
}