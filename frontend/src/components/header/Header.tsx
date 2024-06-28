import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import AccountToolbar from "./AccountToolbar";
import NavToolbar from "./NavToolbar";

export default function Header() {
  return (
    <AppBar>
      <Toolbar>
        <NavToolbar />
        <AccountToolbar />
      </Toolbar>
    </AppBar>
  );
}
