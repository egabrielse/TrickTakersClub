import { Typography } from "@mui/material";
import { HAND_PHASE } from "../../../../../constants/game";
import { useAppSelector } from "../../../../../store/hooks";
import handSlice from "../../../../../store/slices/hand.slice";
import ProfileSnapshot from "../../../../common/ProfileSnapshot";

export default function UpNextIndicator() {
  const upNextId = useAppSelector(handSlice.selectors.upNextId);
  const phase = useAppSelector(handSlice.selectors.phase);

  if (upNextId) {
    return (
      <Typography className="loading-text" component="span" variant="body1">
        <ProfileSnapshot size="small" variant="avatar" uid={upNextId} />
        {phase === HAND_PHASE.CALL
          ? "is calling"
          : phase === HAND_PHASE.BURY
            ? "is burying"
            : "is up"}
      </Typography>
    );
  }
  return null;
}
