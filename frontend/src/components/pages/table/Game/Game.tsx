import { Button } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/commands";
import { TableState } from "../TablePage";

export default function Game() {
  const { playerHand, upNextId, sendCommand } = useContext(TableState);

  return (
    <div className="Game">
      <div>
        <Button
          id="end-game"
          variant="contained"
          onClick={() => {
            sendCommand({
              name: COMMAND_TYPES.END_GAME,
              data: undefined,
            });
          }}
        >
          End Game
        </Button>
      </div>
      {playerHand.map((card) => (
        <div>{card.rank + "-" + card.suit}</div>
      ))}
      <div>Up next: {upNextId}</div>
    </div>
  );
}
