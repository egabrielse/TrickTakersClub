import { Typography } from "@mui/material";
import { useAppSelector } from "../../../../../store/hooks";
import selectors from "../../../../../store/selectors";
import Card from "../../../../common/Card";
import "./TrickPile.scss";

type TrickPileProps = {
  playerId: string;
};

export default function TrickPile({ playerId }: TrickPileProps) {
  const tricksWon = useAppSelector(selectors.tricksWon);
  const countOfTricksWon = tricksWon[playerId] || 0;

  return (
    <div className="TrickPile">
      <Typography variant="overline" color="white">
        Tricks Won
      </Typography>
      <div className="TrickPile-Cards">
        {countOfTricksWon === 0 ? (
          <Card id="empty-trick-pile" card="empty" />
        ) : (
          <Card
            id={`non-empty-trick-pile`}
            card="back"
            overlayText={`x${countOfTricksWon}`}
          />
        )}
      </div>
    </div>
  );
}
