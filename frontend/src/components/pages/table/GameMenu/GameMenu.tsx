import { Divider, Paper } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContextProvider";
import { ChannelContext } from "../ChannelContextProvider";
import { TableState } from "../TablePage";
import "./GameMenu.scss";
import GameSeating from "./GameSeating";
import GameSettingsForm from "./GameSettingsForm";

export default function GameMenu() {
  const { hostId } = useContext(ChannelContext);
  const { gameInProgress } = useContext(TableState);
  const { user } = useContext(AuthContext);
  const isHost = user?.uid === hostId;

  return (
    <Paper className="GameMenu">
      {isHost || gameInProgress ? (
        <div className="GameMenu-Settings">
          <GameSettingsForm />
        </div>
      ) : (
        <div className="GameMenu-Waiting">
          <span className="loading-text">
            Waiting for host to start the game
          </span>
        </div>
      )}
      {gameInProgress && (
        <>
          <Divider orientation="vertical" />
          <div className="GameMenu-Players">
            <GameSeating />
          </div>
        </>
      )}
    </Paper>
  );
}
