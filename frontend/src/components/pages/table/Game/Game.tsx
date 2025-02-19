import { useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { MIN_GAME_HEIGHT, MIN_GAME_WIDTH } from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import authSlice from "../../../../store/slices/auth.slice";
import { arrangeSeats } from "../../../../utils/game";
import Center from "./Center";
import "./Game.scss";
import GameUpdates from "./GameUpdates";
import PlayerSeat from "./Seating/PlayerSeat";
import Seat from "./Seating/Seat";

export default function Game() {
  const uid = useAppSelector(authSlice.selectors.uid);
  const playerOrder = useAppSelector(selectors.playerOrderStartingWithUser);
  const [height, setHeight] = useState(MIN_GAME_HEIGHT);
  const [width, setWidth] = useState(MIN_GAME_WIDTH);

  useEffect(() => {
    arrangeSeats(playerOrder);
  }, [height, playerOrder, width]);

  const { ref } = useResizeDetector({
    refreshMode: "debounce",
    refreshRate: 200,
    onResize: (dimensions) => {
      setHeight(dimensions.height || MIN_GAME_HEIGHT);
      setWidth(dimensions.width || MIN_GAME_WIDTH);
    },
  });

  return (
    <div ref={ref} id="game-context" className="Game">
      <GameUpdates />
      <Center />
      {playerOrder.map((playerId) =>
        uid === playerId ? (
          <PlayerSeat key={playerId} playerId={playerId} />
        ) : (
          <Seat key={playerId} playerId={playerId} />
        ),
      )}
    </div>
  );
}
