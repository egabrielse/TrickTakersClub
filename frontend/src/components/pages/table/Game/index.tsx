import { useEffect } from "react";
import { HAND_PHASE } from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import handSlice from "../../../../store/slices/hand.slice";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import PlayerHand from "../PlayerHand";
import Bury from "./BuriedCards";
import Blind from "./Center/Blind";
import CallAnAce from "./Center/CallAnAce";
import Trick from "./Center/Trick";
import GameUpdates from "./GameUpdates";
import TrickPile from "./TrickPile";

export default function Game() {
  const isUpNext = useAppSelector(selectors.isUpNext);
  const phase = useAppSelector(handSlice.selectors.phase);
  const playerOrder = useAppSelector(selectors.playerOrderStartingWithUser);

  useEffect(() => {
    playerOrder.forEach((playerId, index) => {
      const seat = document.getElementById(`player-${playerId}`);
      if (seat) {
        seat.style.position = "absolute";
        switch (index) {
          case 0:
            // Player 1 (bottom )
            seat.style.left = "50%";
            seat.style.transform = "translateX(-50%)";
            seat.style.bottom = "200px";
            break;
          case 1:
            // Player 2 (left )
            seat.style.left = "0px";
            seat.style.top = "45%";
            seat.style.transform = "translateY(-50%) rotate(90deg)";
            break;
          case 2:
            // Player 3 (top left)
            seat.style.left = "33%";
            seat.style.transform = "translateX(-25%)";
            seat.style.top = "0px";
            break;
          case 3:
            // Player 4 (top right)
            seat.style.right = "25%";
            seat.style.transform = "translateX(25%)";
            seat.style.top = "0px";
            break;
          case 4:
            // Player 5 (right )
            seat.style.right = "0px";
            seat.style.top = "50%";
            seat.style.transform = "translateY(-50%) rotate(-90deg)";
            break;
        }
      }
    });
  }, [playerOrder]);

  return (
    <>
      <div
        style={{
          width: 2,
          height: 2,
          background: "red",
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      />
      {phase === HAND_PHASE.PICK && <Blind />}
      {phase === HAND_PHASE.CALL && isUpNext && <CallAnAce />}
      {phase === HAND_PHASE.PLAY && <Trick />}
      <GameUpdates />
      <PlayerHand />
      <Bury />
      <TrickPile />
      {playerOrder.map((playerId) => (
        <ProfileSnapshot
          id={`player-${playerId}`}
          variant="name-row"
          size="small"
          key={playerId}
          uid={playerId}
        />
      ))}
    </>
  );
}
