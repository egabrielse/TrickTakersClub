import { Divider, Paper } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContextProvider";
import { TableContext } from "../TableLoader";
import { TableState } from "../TablePage";
import "./GameMenu.scss";
import GameSeating from "./GameSeating";
import GameSettingsForm from "./GameSettingsForm";

export default function GameMenu() {
  const { hostId } = useContext(TableContext);
  const { initialized } = useContext(TableState);
  const { user } = useContext(AuthContext);
  const isHost = user?.uid === hostId;

  return (
    <Paper className="GameMenu">
      {isHost || initialized ? (
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
      {initialized && (
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
