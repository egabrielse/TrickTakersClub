import { useEffect } from "react";
import { useAppSelector } from "../../../../../store/hooks";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import Card from "../../../../common/Card";

export default function Trick() {
  const playerOrder = useAppSelector(selectors.playerOrderStartingWithUser);
  const currentTrick = useAppSelector(handSlice.selectors.currentTrick);

  useEffect(() => {
    if (currentTrick) {
      Object.entries(currentTrick.cards).forEach(([playerId, card]) => {
        if (card) {
          const index = playerOrder.indexOf(playerId);
          const playedCard = document.getElementById(
            `card-${card.suit}-${card.rank}`,
          );
          if (playedCard) {
            playedCard.style.position = "absolute";
            playedCard.style.zIndex = String(index);
            playedCard.style.top = "40%";
            playedCard.style.left = "50%";
            playedCard.style.transform = "translate(-50%, -10%)";
            playedCard.style.transformOrigin = "top left";
            switch (index) {
              case 0:
                break;
              case 1:
                playedCard.style.rotate = "85deg";
                break;
              case 2:
                playedCard.style.rotate = "160deg";
                break;
              case 3:
                playedCard.style.rotate = "230deg";
                break;
              case 4:
                playedCard.style.rotate = "275deg";
                break;
            }
          }
        }
      });
    }
  }, [currentTrick, playerOrder]);

  return currentTrick
    ? Object.values(currentTrick.cards).map((card) => (
        <Card
          id={`card-${card.suit}-${card.rank}`}
          key={`card-${card.suit}-${card.rank}`}
          card={card}
          size="medium"
        />
      ))
    : null;
}
