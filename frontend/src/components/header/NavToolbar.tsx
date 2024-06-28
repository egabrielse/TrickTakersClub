import { Container, Toolbar } from "@mui/material";
import AppLogo from "../common/AppLogo";
import AppName from "../common/AppName";
import Spacer from "./Spacer";

export default function NavToolbar() {
  return (
    <Container maxWidth="xl" disableGutters>
      <Toolbar disableGutters>
        <AppLogo size="small" color="white" />
        <Spacer width={16} />
        <AppName size="small" color="white" />
      </Toolbar>
    </Container>
  );
}
