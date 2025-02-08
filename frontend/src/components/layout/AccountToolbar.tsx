import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Menu, MenuItem } from "@mui/material";
import { signOut } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../constants/dialog";
import { PATHS } from "../../constants/url";
import auth from "../../firebase/auth";
import authSlice from "../../store/slices/auth.slice";
import { useAppSelector } from "../../store/store";
import PaperButton from "../common/PaperButton";
import ProfileSnapshot from "../common/ProfileSnapshot";
import { DialogContext } from "../dialog/DialogProvider";
import { AuthContext } from "../pages/auth/AuthContextProvider";
import "./AccountToolbar.scss";

export default function AccountToolbar() {
  const { openDialog } = useContext(DialogContext);
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

  const handleLogin = () => {
    openDialog({ type: DIALOG_TYPES.LOGIN, closeable: true });
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
  } else {
    return (
      <div className="AccountToolbar">
        {!isAuthenticated ? (
          <PaperButton
            id="login-button"
            name="login-button"
            onClick={handleLogin}
            startIcon={<LoginIcon />}
          >
            Login
          </PaperButton>
        ) : (
          <>
            <PaperButton
              id="profile-button"
              name="profile-button"
              onClick={handleOpenUserMenu}
            >
              <ProfileSnapshot uid={uid} variant="name-row" size="medium" />
            </PaperButton>
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
        )}
      </div>
    );
  }
}
