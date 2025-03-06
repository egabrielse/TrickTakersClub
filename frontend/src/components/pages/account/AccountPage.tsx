import {
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import settingsSlice from "../../../store/slices/settings.slice";
import ProfilePic from "../../common/Profile/ProfilePic";
import ProfileProvider from "../../common/Profile/ProfileProvider";
import "./AccountPage.scss";

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const uid = useAppSelector(authSlice.selectors.uid);
  const displayName = useAppSelector(authSlice.selectors.displayName);
  const email = useAppSelector(authSlice.selectors.email);
  const settings = useAppSelector(settingsSlice.selectors.settings);

  return (
    <div className="AccountPage">
      <Paper className="AccountPage-Paper">
        <ProfileProvider uid={uid}>
          <ProfilePic size="xxlarge" />
        </ProfileProvider>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label>Username:</label>
          <div>{displayName}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label>Email:</label>
          <div>{email}</div>
        </div>
        <Typography variant="h4">Settings</Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={settings.soundOn} />}
            onClick={() =>
              dispatch(
                settingsSlice.actions.asyncSaveUserSettings({
                  ...settings,
                  soundOn: !settings.soundOn,
                }),
              )
            }
            label="Sound On"
          />
        </FormGroup>
      </Paper>
    </div>
  );
}
