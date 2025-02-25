import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PlayIcon from "@mui/icons-material/PlayArrow";
import { Button, Typography } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import tableSlice from "../../../../store/slices/table.slice";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import ConnectionContext from "../ConnectionContext";
import EmptySeat from "./EmptySeat";
import "./GameSeating.scss";

export default function GameSeating() {
  const { sendCommand } = useContext(ConnectionContext);
  const seating = useAppSelector(tableSlice.selectors.seating);
  const settings = useAppSelector(tableSlice.selectors.settings);
  const isHost = useAppSelector(selectors.isHost);
  const isSeated = useAppSelector(selectors.isSeated);
  const tableFull = seating.length >= settings!.playerCount;

  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < settings!.playerCount; i++) {
      if (seating.length > i) {
        const uid = seating[i];
        seats.push(<ProfileSnapshot key={uid} uid={uid} variant="name-row" />);
      } else {
        seats.push(<EmptySeat key={`empty-seat-${i}`} />);
      }
    }
    return seats;
  };

  const sitDown = () => {
    sendCommand({ name: COMMAND_TYPES.SIT_DOWN, data: undefined });
  };

  const standUp = () => {
    sendCommand({ name: COMMAND_TYPES.STAND_UP, data: undefined });
  };

  const startGame = () => {
    sendCommand({ name: COMMAND_TYPES.START_GAME, data: undefined });
  };

  return (
    <div className="GameSeating">
      <Typography variant="h2">Players</Typography>
      <div className="GameSeating-PlayerList">{renderSeats()}</div>
      <Button
        id="seat-button"
        startIcon={isSeated ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        onClick={isSeated ? standUp : sitDown}
        disabled={isHost}
        color={isSeated ? "secondary" : "primary"}
        variant={isSeated ? "outlined" : "contained"}
      >
        {isSeated ? "Stand Up" : "Sit Down"}
      </Button>
      {isHost && (
        <Button
          id="start-game-button"
          startIcon={<PlayIcon />}
          onClick={startGame}
          disabled={!tableFull}
        >
          Start Game
        </Button>
      )}
    </div>
  );
}
