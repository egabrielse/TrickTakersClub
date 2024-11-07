import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../constants/dialog";
import { PATHS } from "../../constants/url";
import authActions from "../../redux/features/auth/actions";
import dialogActions from "../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAuthLoading, selectAuthUser } from "../../redux/selectors";
import UserSnapshot from "../common/UserSnapshot";
import "./AccountToolbar.scss";

export default function AccountToolbar() {
  const loading = useAppSelector(selectAuthLoading);
  const user = useAppSelector(selectAuthUser);
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
    dispatch(dialogActions.openDialog({ type: DIALOG_TYPES.LOGIN }));
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(authActions.logout());
  };

  const handleOpenAccountPage = () => {
    navigate(PATHS.ACCOUNT);
    handleCloseUserMenu();
  };

  if (loading) {
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
            <IconButton onClick={handleOpenUserMenu} style={{ padding: 0 }}>
              <UserSnapshot user={user} variant="avatar" size="large" />
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
        )}
      </div>
    );
  }
}
