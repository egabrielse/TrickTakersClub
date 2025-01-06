import { Button, Typography } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../../constants/commands";
import { CardSize } from "../../../../../types/game";
import CardList from "../../../../common/CardList";
import { AuthContext } from "../../../auth/AuthContextProvider";
import { TableState } from "../../TablePage";
import "./Blind.scss";

type BlindProps = {
  blindSize: number;
  cardSize?: CardSize;
};

export default function Blind({ blindSize, cardSize }: BlindProps) {
  const { user } = useContext(AuthContext);
  const { upNextId, sendCommand } = useContext(TableState);
  const userIsUpNext = user?.uid === upNextId;

  const handlePick = (pick: boolean) => {
    console.log("Picking", pick);
    sendCommand({ name: COMMAND_TYPES.PICK, data: pick });
  };

  return (
    <div className="Blind">
      {userIsUpNext && (
        <Button
          color="primary"
          variant="contained"
          className="Blind-VerticalButton"
          onClick={() => handlePick(true)}
          children={<Typography variant="overline">Pick</Typography>}
        />
      )}
      <CardList
        cards={Array.from({ length: blindSize }, () => undefined)}
        cardSize={cardSize}
        overlap
      />
      {userIsUpNext && (
        <Button
          color="secondary"
          variant="contained"
          className="Blind-VerticalButton"
          onClick={() => handlePick(false)}
          children={<Typography variant="overline">Pass</Typography>}
        />
      )}
    </div>
  );
}
