import { useCallback } from "react";
import { ResizePayload, useResizeDetector } from "react-resize-detector";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../../store/store";
import { PlayingCard } from "../../../../../types/card";
import Card from "../../../../common/Card";
import "./Trick.scss";

export default function Trick() {
  const playerOrder = useAppSelector(selectors.playerOrderStartingWithUser);
  const currentTrick = useAppSelector(handSlice.selectors.currentTrick);

  /**
   * Layout players around the table
   */
  const layoutPlayer = useCallback(
    (payload: ResizePayload) => {
      const { width, height } = payload;
      if (!width || !height) return;
      const radius = width / 3;
      let angle = Math.PI / 2; // Start assigning fields from the bottom
      const step = (2 * Math.PI) / playerOrder.length; // Divide the circle into equal parts

      // Position each player around the table
      playerOrder.forEach((playerId) => {
        const player = document.getElementById(`played-card-${playerId}`);
        if (player) {
          // Update position of player's seat
          const x = Math.round(
            width / 2 + radius * Math.cos(angle) - player.offsetWidth / 2,
          );
          const y = Math.round(
            height / 2 + radius * Math.sin(angle) - player.offsetHeight / 2,
          );
          player.style.left = `${x}px`;
          player.style.top = `${y}px`;
          player.style.transform = `rotate(${angle + 380 / Math.PI}rad)`;
          angle += step;
        }
      });
    },
    [playerOrder],
  );

  const { ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: "debounce",
    refreshRate: 250,
    onResize: layoutPlayer,
  });

  return (
    <div className="Trick" ref={ref}>
      {playerOrder.map((playerId) => {
        let card: PlayingCard | "empty" = "empty";
        if (currentTrick && currentTrick.cards[playerId]) {
          card = currentTrick.cards[playerId];
        }
        return (
          <Card id={`played-card-${playerId}`} key={playerId} card={card} />
        );
      })}
    </div>
  );
}
