import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector } from "../../../../store/hooks";
import handSlice from "../../../../store/slices/hand.slice";
import Card from "../../../common/Card";
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
      <Typography className="BuriedCardsLabel" variant="body1" color="white">
        BURIED CARDS
      </Typography>
      {bury.map((card) => (
        <Card
          id={`card-${card.suit}-${card.rank}`}
          key={`card-${card.suit}-${card.rank}`}
          card={card}
          size="medium"
          disabled
        />
      ))}
    </>
  );
}
