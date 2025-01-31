import { useContext, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import { MIN_GAME_HEIGHT, MIN_GAME_WIDTH } from "../../../../constants/game";
import { arrangePointsOnEllipse } from "../../../../utils/game";
import { TableState } from "../TableStateProvider";
import Center from "./Center/Center";
import "./Game.scss";
import Seat from "./Seat";

export default function Game() {
  const { playerOrder } = useContext(TableState);
  const [height, setHeight] = useState(MIN_GAME_HEIGHT);
  const [width, setWidth] = useState(MIN_GAME_WIDTH);

  useEffect(() => {
    const coords = arrangePointsOnEllipse(width, height, playerOrder.length);
    playerOrder.forEach((playerId, i) => {
      const seat = document.getElementById(`seat-${playerId}`);
      if (seat) {
        seat.style.left = `${coords[i].x}px`;
        seat.style.top = `${coords[i].y}px`;
      }
    });
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
      {playerOrder.map((playerId) => (
        <Seat key={playerId} playerId={playerId} />
      ))}
    </div>
  );
}
