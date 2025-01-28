import { Paper, Typography } from "@mui/material";
import { useContext } from "react";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import { AuthContext } from "../../auth/AuthContextProvider";
import { TableState } from "../TableStateProvider";
import "./UpNextIndicator.scss";

export default function UpNextIndicator() {
  const { upNextId } = useContext(TableState);
  const { user } = useContext(AuthContext);
  if (!upNextId) {
    return null;
  } else {
    return (
      <Paper className="UpNextIndicator">
        {user?.uid === upNextId ? (
          <Typography variant="body1">Your Turn!</Typography>
        ) : (
          <>
            <ProfileSnapshot size="small" variant="avatar" uid={upNextId} />
            <Typography variant="body1">is up!</Typography>
          </>
        )}
      </Paper>
    );
  }
}
