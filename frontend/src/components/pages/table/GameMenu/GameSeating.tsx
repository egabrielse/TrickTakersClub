import { Button } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/commands";
import { AuthContext } from "../../auth/AuthContextProvider";
import { TableContext } from "../TableLoader";
import { TableState } from "../TablePage";
import "./GameSeating.scss";

export default function GameSeating() {
  const { hostId } = useContext(TableContext);
  const { playerOrder, settings, sendCommand } = useContext(TableState);
  const { user } = useContext(AuthContext);
  const isHost = user?.uid === hostId;
  const isSeated = playerOrder.includes(user!.uid);

  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < settings!.playerCount; i++) {
      if (playerOrder.length > i) {
        seats.push(
          <li key={i} className="GameSeating-Seat">
            {playerOrder[i]}
          </li>,
        );
      } else {
        seats.push(
          <li key={i} className="GameSeating-Seat">
            Empty
          </li>,
        );
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
      <ul>{renderSeats()}</ul>
      <Button
        id="seat-button"
        disabled={
          isHost || (isSeated && playerOrder.length >= settings!.playerCount)
        }
        onClick={isSeated ? standUp : sitDown}
      >
        {isSeated ? "Stand Up" : "Sit Down"}
      </Button>
    </div>
  );
}
