import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { PATHS } from "../../constants/url";
import AppLogo from "./AppLogo";
import "./HeaderLogo.scss";

export default function HeaderLogo() {
  const navigate = useNavigate();
  const handleLogoClick = () => navigate(PATHS.HOME);
  return (
    <div className="HeaderLogo" onClick={handleLogoClick}>
      <AppLogo size="large" />
      <Typography variant="h6" sx={{ lineHeight: 0.75 }}>
        &nbsp;TRICK
        <br />
        TAKERS
        <br />
        &nbsp;&nbsp;CLUB
      </Typography>
    </div>
  );
}
