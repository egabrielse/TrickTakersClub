import { Button, Divider } from "@mui/material";
import Tile from "../../common/Tile";
import dialogSlice from "../../../redux/slices/dialog.slice";
import authSlice from "../../../redux/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectAuthLoading, selectUser } from "../../../redux/selectors";
import UserSnapshot from "../../common/UserSnapshot";

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
    <Tile gridArea="profile-tile" loading={loading}>
      {user ? (
        <>
          <UserSnapshot user={user} variant="name-column" size="large" />
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>
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
