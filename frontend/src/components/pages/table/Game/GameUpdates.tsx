import { Paper, Slide, Typography } from "@mui/material";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { BLIND_SIZE, HAND_PHASE } from "../../../../constants/game";
import { BROADCAST_TYPES } from "../../../../constants/message";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import handSlice from "../../../../store/slices/hand.slice";
import { UpdateMessages } from "../../../../types/game";
import PrintedCard from "../../../common/PrintedCard";
import ProfilePic from "../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../common/Profile/ProfileProvider";
import NameBadge from "../OverlayComponents/NameBadge";
import "./GameUpdates.scss";

const renderUpdateMessage = (update: UpdateMessages) => {
  switch (update.name) {
    case BROADCAST_TYPES.BLIND_PICKED:
      return (
        <>
          <ProfileProvider uid={update.data.playerId}>
            <ProfilePic />
          </ProfileProvider>
          &nbsp;
          {update.data.forcePick ? (
            "forced to pick the blind!"
          ) : (
            <>
              is the&nbsp;
              <NameBadge role="picker" />
            </>
          )}
        </>
      );
    case BROADCAST_TYPES.CALLED_CARD:
      return (
        <>
          <NameBadge role="picker" />
          &nbsp;called the&nbsp;
          <PrintedCard
            suit={update.data.card.suit}
            rank={update.data.card.rank}
          />
        </>
      );
    case BROADCAST_TYPES.GONE_ALONE:
      return (
        <>
          <NameBadge role="picker" />
          &nbsp;is going alone!
        </>
      );
    case BROADCAST_TYPES.CARD_PLAYED:
      return (
        <>
          <ProfileProvider uid={update.data.playerId}>
            <ProfilePic />
          </ProfileProvider>
          &nbsp;played the&nbsp;
          <PrintedCard
            suit={update.data.card.suit}
            rank={update.data.card.rank}
          />
        </>
      );
    case BROADCAST_TYPES.PARTNER_REVEALED:
      return (
        <>
          <ProfileProvider uid={update.data.playerId}>
            <ProfilePic />
          </ProfileProvider>
          &nbsp;is revealed as the&nbsp;
          <NameBadge role="partner" />!
        </>
      );
    case BROADCAST_TYPES.TRICK_WON:
      return (
        <>
          <ProfileProvider uid={update.data.playerId}>
            <ProfilePic />
          </ProfileProvider>
          &nbsp; took the trick!
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
  const [nextUpdate, setNextUpdate] = useState<UpdateMessages | null>(null);

  useEffect(() => {
    if (updates.length && !nextUpdate) {
      setNextUpdate(updates[0]);
      dispatch(handSlice.actions.shiftUpdate());
      setTimeout(() => setNextUpdate(null), 3000);
    }
  }, [dispatch, nextUpdate, updates]);

  return (
    <Slide
      direction="up"
      in={Boolean(upNextId && !updates.length) || Boolean(nextUpdate)}
    >
      <Paper id="game-updates" className="GameUpdates">
        <Typography
          component="span"
          fontSize={18}
          className={classNames({ "loading-text": Boolean(!nextUpdate) })}
        >
          {nextUpdate ? (
            // 1. Show the next update in the queue
            renderUpdateMessage(nextUpdate)
          ) : isUpNext ? (
            // 2. Show instructions for the user's turn
            <>
              Your Turn!&nbsp;
              {phase === HAND_PHASE.PICK
                ? "Pick or pass on the blind"
                : phase === HAND_PHASE.CALL
                  ? "Call a card or go it alone"
                  : phase === HAND_PHASE.BURY
                    ? `Pick ${BLIND_SIZE} cards to bury`
                    : phase === HAND_PHASE.PLAY
                      ? "Play a card"
                      : null}
            </>
          ) : (
            // 3. Show info about who is up and what they are doing
            <>
              <ProfileProvider uid={upNextId!}>
                <ProfilePic />
              </ProfileProvider>
              &nbsp;
              {phase === HAND_PHASE.CALL
                ? "is calling"
                : phase === HAND_PHASE.BURY
                  ? "is burying"
                  : "is up"}
            </>
          )}
        </Typography>
      </Paper>
    </Slide>
  );
}
