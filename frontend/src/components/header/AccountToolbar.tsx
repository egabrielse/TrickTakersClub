import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../constants/dialog";
import { PATHS } from "../../constants/url";
import { AuthContext } from "../../firebase/FirebaseAuthProvider";
import dialogActions from "../../redux/features/dialog/actions";
import { useAppDispatch } from "../../redux/hooks";
import UserSnapshot from "../common/UserSnapshot";

export default function AccountToolbar() {
  const { loading, user, logout } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    dispatch(dialogActions.openDialog(DIALOG_TYPES.LOGIN));
  };

  const handleSignUp = () => {
    dispatch(dialogActions.openDialog(DIALOG_TYPES.REGISTER));
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const handleOpenAccountPage = () => {
    navigate(PATHS.ACCOUNT);
    handleCloseUserMenu();
  };

  return (
    <Toolbar disableGutters style={{ gap: 12 }}>
      {loading ? null : user === null ? (
        <>
          <Button
            onClick={handleLogin}
            style={{ textWrap: "nowrap" }}
            variant="contained"
          >
            Login
          </Button>
          <Button
            onClick={handleSignUp}
            style={{ textWrap: "nowrap" }}
            variant="contained"
          >
            Sign Up
          </Button>
        </>
      ) : (
        <>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} style={{ padding: 0 }}>
              <UserSnapshot user={user} variant="avatar" size="large" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={anchorElUser !== null}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleOpenAccountPage}>
              <Typography textAlign="center">Account</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </Toolbar>
  );
}
