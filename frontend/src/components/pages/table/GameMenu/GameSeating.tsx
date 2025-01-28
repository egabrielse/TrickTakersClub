import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PlayIcon from "@mui/icons-material/PlayArrow";
import { Button, Typography } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/message";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import { AuthContext } from "../../auth/AuthContextProvider";
import { ConnectionContext } from "../ConnectionProvider";
import { TableState } from "../TableStateProvider";
import EmptySeat from "./EmptySeat";
import "./GameSeating.scss";

export default function GameSeating() {
  const { hostId } = useContext(ConnectionContext);
  const { seating, settings, sendCommand } = useContext(TableState);
  const { user } = useContext(AuthContext);
  const isHost = user?.uid === hostId;
  const isSeated = seating.includes(user!.uid);
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
      <Typography variant="h1">Players</Typography>
      <div className="GameSeating-PlayerList">{renderSeats()}</div>
      <Button
        id="seat-button"
        startIcon={isSeated ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        onClick={isSeated ? standUp : sitDown}
        disabled={isHost || (isSeated && tableFull)}
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
