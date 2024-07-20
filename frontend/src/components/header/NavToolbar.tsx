import { Container, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { PATHS } from "../../constants/url";
import AppLogo from "../common/AppLogo";
import StyledTitle from "../common/StyledTitle";
import Spacer from "./Spacer";

export default function NavToolbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnHome = () => {
    if (location.pathname !== PATHS.ROOT) {
      navigate(PATHS.ROOT);
    }
  };
  return (
    <Container maxWidth="xl" disableGutters>
      <Toolbar disableGutters>
        <AppLogo size="small" color="white" onClick={returnHome} />
        <Spacer width={16} />
        <StyledTitle
          title="Trick Takers Club"
          size="xlarge"
          color="white"
          onClick={returnHome}
        />
      </Toolbar>
    </Container>
  );
}
