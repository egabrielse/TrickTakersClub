import { Paper } from "@mui/material";
import authSlice from "../../../store/slices/auth.slice";
import { useAppSelector } from "../../../store/store";
import ProfileSnapshot from "../../common/ProfileSnapshot";
import "./AccountPage.scss";

export default function AccountPage() {
  const uid = useAppSelector(authSlice.selectors.uid);
  const displayName = useAppSelector(authSlice.selectors.displayName);
  const email = useAppSelector(authSlice.selectors.email);
  return (
    <Paper className="AccountPage">
      <ProfileSnapshot uid={uid} variant="avatar" size="xxlarge" />
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
