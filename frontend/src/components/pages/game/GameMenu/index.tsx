import { Divider, Paper, Typography } from "@mui/material";
import { useContext } from "react";
import { PLAYER_COUNT } from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsHost } from "../../../../store/selectors";
import sessionSlice from "../../../../store/slices/session.slice";
import { newStartGameCommand } from "../../../../utils/message";
import ActionButton from "../../../common/ActionButton";
import SessionContext from "../SessionContext";
import GameSettingsForm from "./GameSettingsForm";
import "./index.scss";

export default function GameMenu() {
  const { sendCommand } = useContext(SessionContext);
  const presence = useAppSelector(sessionSlice.selectors.presence);
  const isHost = useAppSelector(selectIsHost);
  const sessionFull = presence.length === PLAYER_COUNT;

  const startGame = () => sendCommand(newStartGameCommand());

  return (
    <Paper id="game-menu" className="GameMenu">
      <GameSettingsForm />
      <Divider orientation="horizontal" flexItem />
      <div className="GameMenu-Bottom">
        {isHost ? (
          <ActionButton
            onClick={() => startGame()}
            disabled={!sessionFull}
            label={"Start Game"}
            color="primary"
          />
        ) : sessionFull ? (
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
