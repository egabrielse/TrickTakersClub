import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import authSlice from "../../../../store/slices/auth.slice";
import PlayingCard from "../../../common/PlayingCard";
import "./TrickPile.scss";

export default function TrickPile() {
  const uid = useAppSelector(authSlice.selectors.uid);
  const tricksWon = useAppSelector(selectors.tricksWon);
  const countOfTricksWon = tricksWon[uid] || 0;

  useEffect(() => {
    const trickPileCard = document.getElementById("trick-pile-card");
    if (trickPileCard) {
      trickPileCard.style.position = "absolute";
      trickPileCard.style.top = "100%";
      trickPileCard.style.right = "25%";
      trickPileCard.style.transform = `translate(50%, -4rem)`;
    }
  }, [countOfTricksWon]);

  if (countOfTricksWon === 0) {
    return null;
  }
  return (
    <>
      <Typography className="TrickPileLabel" variant="body1" color="white">
        {`${countOfTricksWon} TRICK${countOfTricksWon === 1 ? "" : "S"} TAKEN`}
      </Typography>
      <PlayingCard id="trick-pile-card" card="back" disabled />
    </>
  );
}
