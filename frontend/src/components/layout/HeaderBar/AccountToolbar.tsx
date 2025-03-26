import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { signOut } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { PATHS } from "../../../constants/url";
import auth from "../../../firebase/auth";
import { useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import ProfilePic from "../../common/Profile/ProfilePic";
import ProfileProvider from "../../common/Profile/ProfileProvider";
import AuthContext from "../../pages/auth/AuthContext";
import "./AccountToolbar.scss";

export default function AccountToolbar() {
  const { initialized } = useContext(AuthContext);
  const isAuthenticated = useAppSelector(authSlice.selectors.isAuthenticated);
  const uid = useAppSelector(authSlice.selectors.uid);
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    signOut(auth);
  };

  const handleOpenAccountPage = () => {
    navigate(PATHS.ACCOUNT);
    handleCloseUserMenu();
  };

  if (!initialized) {
    return null;
  } else if (!isAuthenticated) {
    return (
      <Button
        id="login-button"
        name="login-button"
        onClick={() => navigate(PATHS.LOGIN)}
        startIcon={<LoginIcon />}
        color="secondary"
        size="medium"
      >
        Login
      </Button>
    );
  } else {
    return (
      <>
        <IconButton
          id="profile-button"
          name="profile-button"
          onClick={handleOpenUserMenu}
        >
          <ProfileProvider uid={uid}>
            <ProfilePic size="large" />
          </ProfileProvider>
        </IconButton>
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
            <ManageAccountsIcon />
            Account
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon />
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  }
}
