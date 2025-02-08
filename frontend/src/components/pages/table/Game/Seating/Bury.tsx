import { Typography } from "@mui/material";
import handSlice from "../../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../../store/store";
import { cardSizeToPixels } from "../../../../../utils/card";
import Card from "../../../../common/Card";
import "./Bury.scss";

export default function Bury() {
  const bury = useAppSelector(handSlice.selectors.bury);
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
