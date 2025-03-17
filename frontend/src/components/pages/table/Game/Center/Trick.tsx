import { useEffect } from "react";
import { useAppSelector } from "../../../../../store/hooks";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import PlayingCard from "../../../../common/PlayingCard";

export default function Trick() {
  const playerOrder = useAppSelector(selectors.playerOrderStartingWithUser);
  const currentTrick = useAppSelector(handSlice.selectors.currentTrick);

  useEffect(() => {
    if (currentTrick) {
      Object.entries(currentTrick.cards).forEach(([playerId, card]) => {
        if (card) {
          const playedCard = document.getElementById(
            `card-${card.suit}-${card.rank}`,
          );
          if (playedCard) {
            playedCard.style.position = "absolute";
            const orderPlayed = currentTrick.turnOrder.indexOf(playerId);
            playedCard.style.zIndex = String(orderPlayed);
            playedCard.style.top = "45%";
            playedCard.style.left = "50%";
            playedCard.style.transform = "translate(-50%, 10%)";
            playedCard.style.transformOrigin = "top left";
            switch (playerOrder.indexOf(playerId)) {
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
        <PlayingCard
          id={`card-${card.suit}-${card.rank}`}
          key={`card-${card.suit}-${card.rank}`}
          card={card}
        />
      ))
    : null;
}
