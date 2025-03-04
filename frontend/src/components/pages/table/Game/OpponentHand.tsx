import { useEffect, useMemo } from "react";
import { HAND_SIZE } from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import handSlice from "../../../../store/slices/hand.slice";
import PlayingCard from "../../../common/PlayingCard";
import PlayingCardFan from "../../../common/PlayingCardFan";

type OpponentHandProps = {
  playerId: string;
  position: "left" | "right" | "top-left" | "top-right";
};

export default function OpponentHand({
  playerId,
  position,
}: OpponentHandProps) {
  const upNextId = useAppSelector(handSlice.selectors.upNextId);
  const tricks = useAppSelector(handSlice.selectors.tricks);
  const countOfCardsPlayed = useMemo(() => {
    if (tricks.length === 0) {
      // No tricks have been played
      return 0;
    } else {
      const currentTrick = tricks[tricks.length - 1];
      if (playerId in currentTrick.cards) {
        // Player has played a card in the current trick
        return tricks.length;
      }
      // Player has not played a card in the current trick
      return tricks.length - 1;
    }
  }, [playerId, tricks]);

  useEffect(() => {
    const element = document.getElementById(`opponent-hand-${playerId}`);
    if (element) {
      element.style.position = "absolute";
      switch (position) {
        case "left":
          element.style.left = "0px";
          element.style.top = "50%";
          element.style.rotate = "90deg";
          break;
        case "top-left":
          element.style.left = "33%";
          element.style.top = "0px";
          element.style.rotate = "180deg";
          break;
        case "top-right":
          element.style.right = "33%";
          element.style.top = "0px";
          element.style.rotate = "180deg";
          break;
        case "right":
          element.style.right = "0px";
          element.style.top = "50%";
          element.style.rotate = "270deg";
          break;
        default:
          break;
      }
    }
  }, [playerId, position]);

  return (
    <PlayingCardFan id={`opponent-hand-${playerId}`}>
      {Array(HAND_SIZE - countOfCardsPlayed)
        .fill("back")
        .map((card, index) => (
          <PlayingCard
            id={`card-${index}-${playerId}`}
            key={`card-${index}-${playerId}`}
            card={card}
            disabled={upNextId !== playerId}
          />
        ))}
    </PlayingCardFan>
  );
}
