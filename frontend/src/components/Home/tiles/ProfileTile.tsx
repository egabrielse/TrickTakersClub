import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Button, Divider } from "@mui/material";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { PATHS } from "../../../constants/path";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectAuthLoading, selectUser } from "../../../redux/selectors";
import authSlice from "../../../redux/slices/auth.slice";
import dialogSlice from "../../../redux/slices/dialog.slice";
import UserSnapshot from "../../common/UserSnapshot";
import Tile from "../../layout/Tile";

export default function ProfileTile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);

  const handleLogin = () => {
    dispatch(dialogSlice.actions.openDialog(DIALOG_TYPES.LOGIN));
  };

  const handleSignUp = () => {
    dispatch(dialogSlice.actions.openDialog(DIALOG_TYPES.REGISTER));
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
  };

  const viewAccount = () => {
    navigate(PATHS.ACCOUNT);
  };

  return (
    <Tile loading={loading} gridArea="profile" spacing="space-evenly">
      {user ? (
        <>
          <UserSnapshot user={user} variant="name-column" size="xlarge" />
          <div
            style={{
              display: "flex",
              width: "100%",
              alignContent: "space-between",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={viewAccount}
              startIcon={<ManageAccountsIcon />}
            >
              Account
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </div>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleLogin}
          >
            Login
          </Button>
          <Divider
            textAlign="center"
            style={{ width: "100%", padding: "1rem 0" }}
          >
            or
          </Divider>
          <Button
            variant="contained"
            fullWidth
            color="secondary"
            onClick={handleSignUp}
          >
            Create Account
          </Button>
        </>
      )}
    </Tile>
  );
}
