import { useEffect } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { selectCardsInHandCounts } from "../../../../store/selectors";
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
  const cardsInHand = useAppSelector(selectCardsInHandCounts);

  useEffect(() => {
    const element = document.getElementById(`opponent-hand-${playerId}`);
    if (element) {
      element.style.position = "absolute";
      switch (position) {
        case "left":
          element.style.left = "-2rem";
          element.style.top = "50%";
          element.style.rotate = "90deg";
          break;
        case "top-left":
          element.style.left = "33%";
          element.style.top = "-2rem";
          element.style.rotate = "180deg";
          break;
        case "top-right":
          element.style.right = "33%";
          element.style.top = "-2rem";
          element.style.rotate = "180deg";
          break;
        case "right":
          element.style.right = "-2rem";
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
      {Array(cardsInHand[playerId])
        .fill("back")
        .map((card, index) => (
          <PlayingCard
            id={`card-${index}-${playerId}`}
            key={`card-${index}-${playerId}`}
            card={card}
            disabled={upNextId !== playerId}
            height={160}
          />
        ))}
    </PlayingCardFan>
  );
}
