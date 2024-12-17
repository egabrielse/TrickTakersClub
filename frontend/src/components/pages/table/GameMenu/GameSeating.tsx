import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button, Typography } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/commands";
import ProfileSnapshot from "../../../common/ProfileSnapshot";
import { AuthContext } from "../../auth/AuthContextProvider";
import { ChannelContext } from "../ChannelContextProvider";
import { TableState } from "../TablePage";
import EmptySeat from "./EmptySeat";
import "./GameSeating.scss";

export default function GameSeating() {
  const { hostId } = useContext(ChannelContext);
  const { playerOrder, gameSettings, sendCommand } = useContext(TableState);
  const { user } = useContext(AuthContext);
  const isHost = user?.uid === hostId;
  const isSeated = playerOrder.includes(user!.uid);
  const tableFull = playerOrder.length >= gameSettings!.playerCount;

  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < gameSettings!.playerCount; i++) {
      if (playerOrder.length > i) {
        const uid = playerOrder[i];
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
    </div>
  );
}
