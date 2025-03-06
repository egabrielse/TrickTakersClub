import { Paper } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import ProfilePic from "../../common/Profile/ProfilePic";
import ProfileProvider from "../../common/Profile/ProfileProvider";
import "./AccountPage.scss";

export default function AccountPage() {
  const uid = useAppSelector(authSlice.selectors.uid);
  const displayName = useAppSelector(authSlice.selectors.displayName);
  const email = useAppSelector(authSlice.selectors.email);
  return (
    <Paper className="AccountPage">
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
    </Paper>
  );
}
