import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppLogo from "../../common/AppLogo";
import AccountToolbar from "./AccountToolbar";
import "./HeaderBar.scss";
import NavigationDropdown from "./NavigationDropdown";
import NavigationTabs from "./NavigationTabs";

export default function HeaderBar() {
  return (
    <AppBar
      className="HeaderBar"
      position="static"
      elevation={5}
      sx={{ zIndex: 5 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
            <NavigationDropdown />
          </Box>

          <Box sx={{ flexGrow: { xs: 1, sm: 0 }, display: "flex" }}>
            <AppLogo size="large" />
            <Typography variant="h6" sx={{ lineHeight: 0.75 }}>
              &nbsp;TRICK
              <br />
              TAKERS
              <br />
              &nbsp;&nbsp;CLUB
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
            <NavigationTabs />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <AccountToolbar />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
