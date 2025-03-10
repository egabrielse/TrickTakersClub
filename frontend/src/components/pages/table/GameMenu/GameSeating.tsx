import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PLAYER_COUNT } from "../../../../constants/game";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import tableSlice from "../../../../store/slices/table.slice";
import ConnectionContext from "../ConnectionContext";
import NameTag from "../OverlayComponents/NameTag";
import EmptySeat from "./EmptySeat";
import "./GameSeating.scss";
import LinkButton from "./LinkButton";

export default function GameSeating() {
  const { sendCommand } = useContext(ConnectionContext);
  const seating = useAppSelector(tableSlice.selectors.seating);
  const isHost = useAppSelector(selectors.isHost);
  const isSeated = useAppSelector(selectors.isSeated);
  const [pending, setPending] = useState(false);

  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < PLAYER_COUNT; i++) {
      if (seating.length > i) {
        const uid = seating[i];
        seats.push(<NameTag key={`name-tag-${i}`} playerId={uid} />);
      } else {
        seats.push(<EmptySeat key={`empty-seat-${i}`} />);
      }
    }
    return seats;
  };

  useEffect(() => {
    // Reset pending once isSeated has changed
    setPending(false);
  }, [isSeated]);

  const sitDown = () => {
    setPending(true);
    sendCommand({ name: COMMAND_TYPES.SIT_DOWN, data: undefined });
    setTimeout(() => setPending(false), 3000);
  };

  const standUp = () => {
    setPending(true);
    sendCommand({ name: COMMAND_TYPES.STAND_UP, data: undefined });
    setTimeout(() => setPending(false), 3000);
  };

  return (
    <div className="GameSeating">
      <Typography variant="h2">Players</Typography>
      <div className="GameSeating-PlayerList">{renderSeats()}</div>
      {!isHost && (
        <Button
          id="seat-button"
          startIcon={isSeated ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          onClick={isSeated ? standUp : sitDown}
          color="primary"
          variant={isSeated ? "outlined" : "contained"}
          disabled={pending}
        >
          {isSeated ? "Stand Up" : "Sit Down"}
        </Button>
      )}
      <LinkButton />
    </div>
  );
}
