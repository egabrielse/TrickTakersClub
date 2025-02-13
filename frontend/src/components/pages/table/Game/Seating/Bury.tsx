import { Typography } from "@mui/material";
import { useAppSelector } from "../../../../../store/hooks";
import handSlice from "../../../../../store/slices/hand.slice";
import Card from "../../../../common/Card";
import CardList from "../../../../common/CardList";
import "./Bury.scss";

export default function Bury() {
  const bury = useAppSelector(handSlice.selectors.bury);

  return (
    <div className="Bury">
      <Typography variant="overline" color="white">
        Bury
      </Typography>
      <CardList orientation="vertical">
        {bury.length === 0
          ? [<Card id="empty-bury" key="empty-bury" card="empty" />]
          : bury.map((card) => (
              <Card
                id={`bury-card-${card.suit}-${card.rank}`}
                key={`bury-card-${card.suit}-${card.rank}`}
                card={card}
              />
            ))}
      </CardList>
    </div>
  );
}
