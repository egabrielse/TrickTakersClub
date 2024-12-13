import { Button } from "@mui/material";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/commands";
import { GAME_SETTINGS_DEFAULTS } from "../../../../constants/game";
import { GameSettings } from "../../../../types/game";
import { TableState } from "../TablePage";
import "./GameSettingsForm.scss";

const DefaultGameSettings: GameSettings = {
  autoDeal: GAME_SETTINGS_DEFAULTS.AUTO_DEAL,
  playerCount: GAME_SETTINGS_DEFAULTS.PLAYER_COUNT,
  callingMethod: GAME_SETTINGS_DEFAULTS.CALLING_METHOD,
  noPickResolution: GAME_SETTINGS_DEFAULTS.NO_PICK_RESOLUTION,
  doubleOnTheBump: GAME_SETTINGS_DEFAULTS.DOUBLE_ON_THE_BUMP,
  blitzing: GAME_SETTINGS_DEFAULTS.BLITZING,
  cracking: GAME_SETTINGS_DEFAULTS.CRACKING,
};

export default function GameSettingsForm() {
  const { sendCommand, initialized } = useContext(TableState);

  const handleSubmit = () => {
    sendCommand({
      name: COMMAND_TYPES.CREATE_GAME,
      data: DefaultGameSettings,
    });
  };

  const handleCancel = () => {
    sendCommand({
      name: COMMAND_TYPES.END_GAME,
      data: undefined,
    });
  };

  return (
    <div>
      {initialized && (
        <Button color="secondary" variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
      )}
      <Button disabled={initialized} onClick={handleSubmit}>
        Confirm
      </Button>
    </div>
  );
}
