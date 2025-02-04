import { useContext, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { MIN_GAME_HEIGHT, MIN_GAME_WIDTH } from "../../../../constants/game";
import { arrangeSeats } from "../../../../utils/game";
import { AuthContext } from "../../auth/AuthContextProvider";
import { TableState } from "../TableStateProvider";
import Center from "./Center/Center";
import "./Game.scss";
import PlayerSeat from "./Seating/PlayerSeat";
import Seat from "./Seating/Seat";

export default function Game() {
  const { user } = useContext(AuthContext);
  const { playerOrder } = useContext(TableState);
  const [height, setHeight] = useState(MIN_GAME_HEIGHT);
  const [width, setWidth] = useState(MIN_GAME_WIDTH);

  useEffect(() => {
    arrangeSeats(width, height, playerOrder);
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
      <Center />
      {playerOrder.map((playerId) =>
        user?.uid === playerId ? (
          <PlayerSeat key={playerId} playerId={playerId} />
        ) : (
          <Seat key={playerId} playerId={playerId} />
        ),
      )}
    </div>
  );
}
