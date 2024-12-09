import { Button, Dialog, Paper, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { MESSAGE_TYPES } from "../../../../constants/message";
import { GameSettings } from "../../../../types/game";
import { AuthContext } from "../../auth/AuthContextProvider";
import { TableContext } from "../TableLoader";
import { TableState } from "../TablePage";
import "./GameSettingsDisplay.scss";
import GameSettingsForm from "./GameSettingsForm";

export default function GameSettingsDisplay() {
  const { hostId } = useContext(TableContext);
  const { gameSettings, sendCommand } = useContext(TableState);
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const onSubmit = (values: GameSettings) => {
    sendCommand(MESSAGE_TYPES.UPDATE_SETTINGS, values);
    setOpen(false);
  };

  return (
    <Paper className="GameSettingsDisplay">
      <Typography variant="h2">Game Settings</Typography>
      <Typography variant="h4">Player Count</Typography>
      <Typography>{gameSettings?.playerCount}</Typography>
      <Typography variant="h4">Calling Method</Typography>
      <Typography>{gameSettings?.callingMethod}</Typography>
      <Typography variant="h4">No Pick Resolution</Typography>
      <Typography>{gameSettings?.noPickResolution}</Typography>
      <Typography variant="h4">Double on the Bump</Typography>
      <Typography>{gameSettings?.doubleOnTheBump ? "Yes" : "No"}</Typography>
      <Typography variant="h4">Blitzing</Typography>
      <Typography>{gameSettings?.blitzing ? "Yes" : "No"}</Typography>
      {user?.uid === hostId && gameSettings !== null && (
        <Button onClick={() => setOpen(true)}>Edit</Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <GameSettingsForm defaults={gameSettings!} onSubmit={onSubmit} />
      </Dialog>
    </Paper>
  );
}
