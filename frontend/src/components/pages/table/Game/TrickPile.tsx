import { useEffect } from "react";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import authSlice from "../../../../store/slices/auth.slice";
import PlayingCard from "../../../common/PlayingCard";
import "./TrickPile.scss";

export default function TrickPile() {
  const uid = useAppSelector(authSlice.selectors.uid);
  const talliedTricks = useAppSelector(selectors.tallyTricks);
  console.log(talliedTricks);
  const tricksWon = talliedTricks[uid]?.[0];
  const pointsWon = talliedTricks[uid]?.[1];

  useEffect(() => {
    const trickPileCard = document.getElementById("trick-pile-card");
    if (trickPileCard) {
      trickPileCard.style.position = "absolute";
      trickPileCard.style.top = "100%";
      trickPileCard.style.right = "25%";
      trickPileCard.style.transform = `translate(50%, -4rem)`;
    }
  }, [tricksWon]);

  if (tricksWon === 0) {
    return null;
  }
  return (
    <>
      <span className="TrickPileLabel">
        {`${tricksWon} TRICK${tricksWon === 1 ? "" : "S"} TAKEN`}
        <br />
        {pointsWon > 0 ? `(${pointsWon}pts)` : ""}
      </span>
      <PlayingCard id="trick-pile-card" card="back" disabled />
    </>
  );
}
