import { useEffect } from "react";
import { useAppSelector } from "../../../../store/hooks";
import handSlice from "../../../../store/slices/hand.slice";
import PlayingCard from "../../../common/PlayingCard";
import PlayingCardFan from "../../../common/PlayingCardFan";

type OpponentHandProps = {
  playerId: string;
  position: "left" | "right" | "top-left" | "top-right";
};

const OPPONENT_HAND = ["back", "back", "back", "back", "back", "back"] as const;

export default function OpponentHand({
  playerId,
  position,
}: OpponentHandProps) {
  const upNextId = useAppSelector(handSlice.selectors.upNextId);

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
      {OPPONENT_HAND.map((card, index) => (
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
