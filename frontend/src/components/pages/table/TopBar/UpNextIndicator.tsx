import { Paper, Typography } from "@mui/material";
import { HAND_PHASE } from "../../../../constants/game";
import selectors from "../../../../store/selectors";
import handSlice from "../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../store/store";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import "./UpNextIndicator.scss";

export default function UpNextIndicator() {
  const upNextId = useAppSelector(handSlice.selectors.upNextId);
  const phase = useAppSelector(handSlice.selectors.phase);
  const isUpNext = useAppSelector(selectors.isUpNext);

  if (!upNextId) {
    return null;
  } else {
    return (
      <Paper className="UpNextIndicator">
        {isUpNext ? (
          <Typography variant="body1">Your Turn!</Typography>
        ) : (
          <>
            <ProfileSnapshot size="small" variant="avatar" uid={upNextId} />
            <Typography
              className="loading-text"
              component="span"
              variant="body1"
            >
              {phase === HAND_PHASE.CALL
                ? "is calling"
                : phase === HAND_PHASE.BURY
                  ? "is burying"
                  : "is up"}
            </Typography>
          </>
        )}
      </Paper>
    );
  }
}
