import { Divider, Paper } from "@mui/material";
import "./GameMenu.scss";
import GameSeating from "./GameSeating";
import GameSettingsForm from "./GameSettingsForm";

export default function GameMenu() {
  return (
    <Paper className="GameMenu">
      <div className="GameMenu-Settings">
        <GameSettingsForm />
      </div>
      <Divider orientation="vertical" />
      <div className="GameMenu-Players">
        <GameSeating />
      </div>
    </Paper>
  );
}
