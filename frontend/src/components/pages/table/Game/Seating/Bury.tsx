import { Typography } from "@mui/material";
import { useContext } from "react";

import { cardSizeToPixels } from "../../../../../utils/card";
import Card from "../../../../common/Card";
import { TableState } from "../../TableStateProvider";
import "./Bury.scss";

export default function Bury() {
  const { bury } = useContext(TableState);
  const { width, height } = cardSizeToPixels("medium");
  const calcHeight = height + (width / 4) * bury.length;
  return (
    <div className="Bury">
      <Typography variant="overline" color="white">
        Bury
      </Typography>
      <div className="Bury-Cards" style={{ width, height: calcHeight }}>
        {bury.length === 0 ? (
          <Card id={`empty-bury`} card="empty" />
        ) : (
          bury.map((card) => (
            <Card
              id={`bury-card-${card}`}
              key={`bury-card-${card}`}
              card={card}
              yOverlap
            />
          ))
        )}
      </div>
    </div>
  );
}
