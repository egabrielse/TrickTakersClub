import { Button, Divider } from "@mui/material";
import Tile from "../../layout/Tile";
import dialogSlice from "../../../redux/slices/dialog.slice";
import authSlice from "../../../redux/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectAuthLoading, selectUser } from "../../../redux/selectors";
import UserSnapshot from "../../common/UserSnapshot";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

export default function ProfileTile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);

  const handleLogin = () => {
    dispatch(dialogSlice.actions.openDialog("login"));
  };

  const handleRegister = () => {
    dispatch(dialogSlice.actions.openDialog("register"));
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
  }

  return (
    <Tile loading={loading} gridArea="profile" spacing="center">
      {user ? (
        <>
          <UserSnapshot user={user} variant="name-column" size="xlarge" />
          <div style={{ display: "flex", width: "100%", alignContent: "space-between", justifyContent: "space-between"}}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              startIcon={<SettingsIcon />}
            >
              Settings
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
            onClick={handleRegister}
          >
            Register
          </Button>
        </>
      )}
    </Tile>
  );
}
