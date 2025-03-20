import { Divider, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { PLAYER_COUNT } from "../../../../constants/game";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsHost } from "../../../../store/selectors";
import tableSlice from "../../../../store/slices/table.slice";
import ActionButton from "../../../common/ActionButton";
import ConnectionContext from "../ConnectionContext";
import GameSeating from "./GameSeating";
import GameSettingsForm from "./GameSettingsForm";
import "./index.scss";

export default function GameMenu() {
  const { sendCommand } = useContext(ConnectionContext);
  const seating = useAppSelector(tableSlice.selectors.seating);
  const isHost = useAppSelector(selectIsHost);
  const tableFull = seating.length === PLAYER_COUNT;

  const startGame = () => {
    sendCommand({ name: COMMAND_TYPES.START_GAME, data: undefined });
  };

  return (
    <Paper id="game-menu" className="GameMenu">
      <div className="GameMenu-Top">
        <GameSettingsForm />
        <Divider orientation="vertical" flexItem />
        <GameSeating />
      </div>
      <Divider orientation="horizontal" flexItem />
      <div className="GameMenu-Bottom">
        {isHost ? (
          <ActionButton
            onClick={() => startGame()}
            disabled={!tableFull}
            label={"Start Game"}
            color="primary"
          />
        ) : tableFull ? (
          <Typography
            component="span"
            className="loading-text"
            fontStyle="italic"
          >
            Waiting for host to start game
          </Typography>
        ) : (
          <i className="loading-text">Waiting for more players</i>
        )}
      </div>
    </Paper>
  );
}
