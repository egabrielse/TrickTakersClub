import { Paper } from "@mui/material";
import { useEffect } from "react";
import { HAND_PHASE } from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import {
  selectIsUpNext,
  selectPlayerOrderStartingWithUser,
} from "../../../../store/selectors";
import handSlice from "../../../../store/slices/hand.slice";
import NameTag from "../OverlayComponents/NameTag";
import NoPickHandDisplay from "../OverlayComponents/NoPickHandDisplay";
import Bury from "./BuriedCards";
import Blind from "./Center/Blind";
import CallAnAce from "./Center/CallAnAce";
import Trick from "./Center/Trick";
import GameUpdates from "./GameUpdates";
import "./index.scss";
import OpponentHand from "./OpponentHand";
import OpponentTrickPile from "./OpponentTrickPile";
import PlayerHand from "./PlayerHand";
import TrickPile from "./TrickPile";

export default function Game() {
  const isUpNext = useAppSelector(selectIsUpNext);
  const phase = useAppSelector(handSlice.selectors.phase);
  const playerOrder = useAppSelector(selectPlayerOrderStartingWithUser);
  const noPickHand = useAppSelector(handSlice.selectors.noPickHand);

  useEffect(() => {
    playerOrder.forEach((playerId, index) => {
      const seat = document.getElementById(`name-tag-${playerId}`);
      if (seat) {
        seat.style.position = "absolute";
        switch (index) {
          case 0:
            // Player 1 (bottom)
            seat.style.left = "50%";
            seat.style.bottom = "1.5rem";
            seat.style.zIndex = "4";
            break;
          case 1:
            // Player 2 (left)
            seat.style.left = "125px";
            seat.style.top = "50%";
            seat.style.transform = "rotate(-90deg)";
            seat.style.zIndex = "4";
            break;
          case 2:
            // Player 3 (top left)
            seat.style.left = "33%";
            seat.style.top = "125px";
            seat.style.zIndex = "4";
            break;
          case 3:
            // Player 4 (top right)
            seat.style.right = "33%";
            seat.style.top = "125px";
            seat.style.zIndex = "4";
            break;
          case 4:
            // Player 5 (right)
            seat.style.right = "125px";
            seat.style.top = "50%";
            seat.style.transform = "rotate(90deg)";
            seat.style.zIndex = "4";
            break;
        }
      }
    });
  }, [playerOrder]);

  return (
    <>
      {phase === HAND_PHASE.PICK && <Blind />}
      {phase === HAND_PHASE.CALL && isUpNext && <CallAnAce />}
      {phase === HAND_PHASE.PLAY && <Trick />}
      <GameUpdates />
      {playerOrder.map((playerId, index) =>
        index === 0 ? (
          <>
            <PlayerHand key={`hand-${playerId}`} />
            <Bury />
            <TrickPile />
          </>
        ) : index === 1 ? (
          <>
            <OpponentHand
              key={`hand-${playerId}`}
              playerId={playerId}
              position="left"
            />
            <OpponentTrickPile playerId={playerId} position="left" />
          </>
        ) : index === 2 ? (
          <>
            <OpponentHand
              key={`hand-${playerId}`}
              playerId={playerId}
              position="top-left"
            />
            <OpponentTrickPile playerId={playerId} position="top-left" />
          </>
        ) : index === 3 ? (
          <>
            <OpponentHand
              key={`hand-${playerId}`}
              playerId={playerId}
              position="top-right"
            />
            <OpponentTrickPile playerId={playerId} position="top-right" />
          </>
        ) : (
          <>
            <OpponentHand
              key={`hand-${playerId}`}
              playerId={playerId}
              position="right"
            />
            <OpponentTrickPile playerId={playerId} position="right" />
          </>
        ),
      )}
      {playerOrder.map((playerId, index) => (
        <div
          key={`name-tag-${playerId}`}
          id={`name-tag-${playerId}`}
          className="NameTagWrapper"
        >
          {index === 0 ? (
            <Paper>
              <NameTag playerId={playerId} />
            </Paper>
          ) : (
            <NameTag playerId={playerId} />
          )}
        </div>
      ))}
      {noPickHand && <NoPickHandDisplay />}
    </>
  );
}
