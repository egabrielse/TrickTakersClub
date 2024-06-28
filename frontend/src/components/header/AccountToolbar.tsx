import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../constants/dialog";
import { PATHS } from "../../constants/path";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/selectors";
import authSlice from "../../redux/slices/auth.slice";
import dialogSlice from "../../redux/slices/dialog.slice";
import UserSnapshot from "../common/UserSnapshot";

export default function AccountToolbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const user = useAppSelector(selectUser);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    dispatch(dialogSlice.actions.openDialog(DIALOG_TYPES.LOGIN));
  };

  const handleSignUp = () => {
    dispatch(dialogSlice.actions.openDialog(DIALOG_TYPES.REGISTER));
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
  };

  const handleOpenAccountPage = () => {
    navigate(PATHS.ACCOUNT);
  };

  return (
    <Toolbar disableGutters style={{ gap: 12 }}>
      {user === null ? (
        <>
          <Tooltip title="Login">
            <Button
              onClick={handleLogin}
              style={{ textWrap: "nowrap" }}
              variant="contained"
            >
              Login
            </Button>
          </Tooltip>
          <Tooltip title="Sign Up">
            <Button
              onClick={handleSignUp}
              style={{ textWrap: "nowrap" }}
              variant="contained"
            >
              Sign In
            </Button>
          </Tooltip>
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
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
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
