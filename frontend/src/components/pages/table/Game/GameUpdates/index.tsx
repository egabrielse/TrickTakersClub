import { Fade, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { HAND_PHASE } from "../../../../../constants/game";
import { BROADCAST_TYPES } from "../../../../../constants/message";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import { UpdateMessages } from "../../../../../types/game";
import { prettyPrintCard } from "../../../../../utils/card";
import ProfileSnapshot from "../../../../common/ProfileSnapshot";
import "./index.scss";

const renderUpdateMessage = (update: UpdateMessages) => {
  switch (update.name) {
    case BROADCAST_TYPES.BLIND_PICKED:
      return (
        <>
          <ProfileSnapshot
            size="small"
            variant="avatar"
            uid={update.data.playerId}
          />
          <Typography>
            {update.data.forcePick
              ? "forced to pick the blind!"
              : "picked the blind!"}
          </Typography>
        </>
      );
    case BROADCAST_TYPES.CALLED_CARD:
      return (
        <Typography>
          Picker called the
          {prettyPrintCard(update.data.card)}!
        </Typography>
      );
    case BROADCAST_TYPES.GONE_ALONE:
      return "Picker is going alone!";
    case BROADCAST_TYPES.CARD_PLAYED:
      return (
        <>
          <ProfileSnapshot
            size="small"
            variant="avatar"
            uid={update.data.playerId}
          />
          <Typography>
            played the&nbsp;
            {prettyPrintCard(update.data.card)}!
          </Typography>
        </>
      );
    case BROADCAST_TYPES.PARTNER_REVEALED:
      return (
        <>
          Partner is revealed!
          <ProfileSnapshot
            size="small"
            variant="avatar"
            uid={update.data.playerId}
          />
          <Typography>is the partner!</Typography>
        </>
      );
    case BROADCAST_TYPES.TRICK_DONE:
      return (
        <>
          <ProfileSnapshot
            size="small"
            variant="avatar"
            uid={update.data?.trickSummary?.takerId}
          />
          <Typography>took the trick!</Typography>
        </>
      );
    default:
      return null;
  }
};

export default function GameUpdates() {
  const dispatch = useAppDispatch();
  const updates = useAppSelector(handSlice.selectors.updates);
  const upNextId = useAppSelector(handSlice.selectors.upNextId);
  const phase = useAppSelector(handSlice.selectors.phase);
  const isUpNext = useAppSelector(selectors.isUpNext);
  const blindSize = useAppSelector(handSlice.selectors.blindSize);
  const [nextUpdate, setNextUpdate] = useState<UpdateMessages | null>(null);

  useEffect(() => {
    if (updates.length && !nextUpdate) {
      setNextUpdate(updates[0]);
      dispatch(handSlice.actions.shiftUpdate());
      setTimeout(() => setNextUpdate(null), 2000);
    }
  }, [dispatch, nextUpdate, updates]);

  return (
    <Fade in={Boolean(upNextId && !updates.length) || Boolean(nextUpdate)}>
      <Paper id="game-updates" className="GameUpdates">
        {nextUpdate ? (
          // 1. Show the next update in the queue
          renderUpdateMessage(nextUpdate)
        ) : isUpNext ? (
          // 2. Show instructions for the user's turn
          <Typography component="span" className="loading-text">
            Your Turn!&nbsp;
            {phase === HAND_PHASE.PICK
              ? "Pick or pass on the blind"
              : phase === HAND_PHASE.CALL
                ? "Call a card or go it alone"
                : phase === HAND_PHASE.BURY
                  ? `Pick ${blindSize} cards to bury`
                  : phase === HAND_PHASE.PLAY
                    ? "Play a card"
                    : null}
          </Typography>
        ) : (
          // 3. Show info about who is up and what they are doing
          <>
            <ProfileSnapshot size="small" variant="avatar" uid={upNextId!} />
            <Typography component="span" className="loading-text">
              {phase === HAND_PHASE.CALL
                ? "is calling"
                : phase === HAND_PHASE.BURY
                  ? "is burying"
                  : "is up"}
            </Typography>
          </>
        )}
      </Paper>
    </Fade>
  );
}
