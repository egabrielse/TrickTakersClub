import { Button, Typography } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/message";
import selectors from "../../../../../store/selectors";
import handSlice from "../../../../../store/slices/hand.slice";
import { useAppSelector } from "../../../../../store/store";
import Card from "../../../../common/Card";
import CardList from "../../../../common/CardList";
import ConnectionContext from "../../ConnectionContext";
import "./Blind.scss";

export default function Blind() {
  const { sendCommand } = useContext(ConnectionContext);
  const isUpNext = useAppSelector(selectors.isUpNext);
  const blindSize = useAppSelector(handSlice.selectors.blindSize);

  const handlePick = () => {
    sendCommand({ name: COMMAND_TYPES.PICK, data: undefined });
  };

  const handlePass = () => {
    sendCommand({ name: COMMAND_TYPES.PASS, data: undefined });
  };

  return (
    <div className="Blind">
      {isUpNext && (
        <Button
          color="primary"
          variant="contained"
          className="Blind-VerticalButton"
          onClick={handlePick}
          children={<Typography variant="overline">Pick</Typography>}
        />
      )}
      <CardList>
        {Array.from({ length: blindSize }).map((_, index) => (
          <Card
            id={`blind-card-${index}`}
            key={`blind-card-${index}`}
            card="back"
          />
        ))}
      </CardList>
      {isUpNext && (
        <Button
          color="secondary"
          variant="contained"
          className="Blind-VerticalButton"
          onClick={handlePass}
          children={<Typography variant="overline">Pass</Typography>}
        />
      )}
    </div>
  );
}
