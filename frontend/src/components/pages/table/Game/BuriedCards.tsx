import { useEffect } from "react";
import { useAppSelector } from "../../../../store/hooks";
import handSlice from "../../../../store/slices/hand.slice";
import { countCardPoints } from "../../../../utils/card";
import PlayingCard from "../../../common/PlayingCard";
import "./BuriedCards.scss";

/**
 * Displays the player's buried cards.
 */
export default function BuriedCards() {
  const bury = useAppSelector(handSlice.selectors.bury);

  useEffect(() => {
    const halfLength = bury.length / 2;
    bury.forEach((card) => {
      const buriedCard = document.getElementById(
        `card-${card.suit}-${card.rank}`,
      );
      if (buriedCard) {
        buriedCard.style.position = "absolute";
        buriedCard.style.top = "100%";
        buriedCard.style.left = "25%";
        buriedCard.style.transform = `translate(-50%, -4rem) translateX(${
          (bury.indexOf(card) - halfLength) * 20 + 10
        }%)`;
      }
    });
  }, [bury]);

  if (bury.length === 0) {
    return null;
  }
  return (
    <>
      <span className="BuriedCardsLabel">
        BURIED CARDS
        <br />
        {`(${countCardPoints(bury)}pts)`}
      </span>
      {bury.map((card) => (
        <PlayingCard
          id={`card-${card.suit}-${card.rank}`}
          key={`card-${card.suit}-${card.rank}`}
          card={card}
          disabled
        />
      ))}
    </>
  );
}
