import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Menu, MenuItem } from "@mui/material";
import { signOut } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../constants/dialog";
import { PATHS } from "../../constants/url";
import auth from "../../firebase/auth";
import PaperButton from "../common/PaperButton";
import ProfileSnapshot from "../common/ProfileSnapshot";
import { DialogContext } from "../dialog/DialogProvider";
import { AuthContext } from "../pages/auth/AuthContextProvider";
import "./AccountToolbar.scss";

export default function AccountToolbar() {
  const { openDialog } = useContext(DialogContext);
  const { initialized, user } = useContext(AuthContext);
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

  console.log(user);

  if (!initialized) {
    return null;
  } else {
    return (
      <div className="AccountToolbar">
        {user === null ? (
          <button onClick={handleLogin} style={{ textWrap: "nowrap" }}>
            Login
          </button>
        ) : (
          <>
            <PaperButton
              id="profile-button"
              name="profile-button"
              onClick={handleOpenUserMenu}
            >
              <ProfileSnapshot uid={user.uid} variant="name-row" size="large" />
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
