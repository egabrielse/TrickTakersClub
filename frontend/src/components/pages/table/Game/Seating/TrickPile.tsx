import { Typography } from "@mui/material";
import { useContext, useMemo } from "react";
import Card from "../../../../common/Card";
import { TableState } from "../../TableStateProvider";
import "./TrickPile.scss";

type TrickPileProps = {
  playerId: string;
};

export default function TrickPile({ playerId }: TrickPileProps) {
  const { tricks } = useContext(TableState);
  const tricksWon = useMemo(() => {
    return tricks.filter((trick) => {
      const isTrickTaker = trick.takerId === playerId;
      const isTrickComplete =
        Object(trick.cards).length === trick.turnOrder.length;
      return isTrickTaker && isTrickComplete;
    });
  }, [playerId, tricks]);

  return (
    <div className="TrickPile">
      <Typography variant="overline" color="white">
        Tricks Won
      </Typography>
      <div className="TrickPile-Cards">
        {tricksWon.length === 0 ? (
          <Card id={`empty-bury`} card="empty" />
        ) : (
          <Card
            id={`empty-bury`}
            card="back"
            overlayText={`x${tricksWon.length}`}
          />
        )}
      </div>
    </div>
  );
}
