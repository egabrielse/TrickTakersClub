import { HAND_PHASE } from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import {
  selectIsUpNext,
  selectPlayerOrderStartingWithUser,
} from "../../../../store/selectors";
import handSlice from "../../../../store/slices/hand.slice";
import NoPickHandDisplay from "../OverlayComponents/NoPickHandDisplay";
import Bury from "./BuriedCards";
import Blind from "./Center/Blind";
import CallAnAce from "./Center/CallAnAce";
import Trick from "./Center/Trick";
import GameUpdates from "./GameUpdates";
import OpponentHand from "./OpponentHand";
import OpponentTrickPile from "./OpponentTrickPile";
import PlayerHand from "./PlayerHand";
import PlayerNamePlate from "./PlayerNamePlate";
import TrickPile from "./TrickPile";

export default function Game() {
  const isUpNext = useAppSelector(selectIsUpNext);
  const phase = useAppSelector(handSlice.selectors.phase);
  const playerOrder = useAppSelector(selectPlayerOrderStartingWithUser);
  const noPickHand = useAppSelector(handSlice.selectors.noPickHand);

  return (
    <>
      {(phase === HAND_PHASE.PICK || noPickHand) && <Blind />}
      {phase === HAND_PHASE.CALL && isUpNext && <CallAnAce />}
      {phase === HAND_PHASE.PLAY && <Trick />}
      {noPickHand && <NoPickHandDisplay />}
      <GameUpdates />
      <Bury />
      <TrickPile />
      {playerOrder.map((playerId, index) =>
        index === 0 ? (
          <PlayerHand key={`hand-${playerId}`} />
        ) : (
          <OpponentHand
            key={`hand-${playerId}`}
            playerId={playerId}
            position={
              index === 1
                ? "left"
                : index === 2
                  ? "top-left"
                  : index === 3
                    ? "top-right"
                    : "right"
            }
          />
        ),
      )}
      {playerOrder.map((playerId, index) =>
        index === 0 ? (
          <TrickPile key={`trick-pile${playerId}`} />
        ) : (
          <OpponentTrickPile
            key={`trick-pile${playerId}`}
            playerId={playerId}
            position={
              index === 1
                ? "left"
                : index === 2
                  ? "top-left"
                  : index === 3
                    ? "top-right"
                    : "right"
            }
          />
        ),
      )}
      {playerOrder.map((playerId, index) => (
        <PlayerNamePlate
          key={`name-tag-${playerId}`}
          playerId={playerId}
          position={
            index === 0
              ? "bottom"
              : index === 1
                ? "left"
                : index === 2
                  ? "top-left"
                  : index === 3
                    ? "top-right"
                    : "right"
          }
        />
      ))}
    </>
  );
}
