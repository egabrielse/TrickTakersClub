import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  CALLING_METHODS,
  NO_PICK_RESOLUTIONS,
} from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import { selectIsHost } from "../../../../store/selectors";
import gameSlice from "../../../../store/slices/game.slice";
import {
  newUpdateCallingMethodCommand,
  newUpdateDoubleOnTheBumpCommand,
  newUpdateNoPickResolutionCommand,
} from "../../../../utils/message";
import SessionContext from "../SessionContext";
import "./GameSettingsForm.scss";

export default function GameSettingsForm() {
  const isHost = useAppSelector(selectIsHost);
  const { sendCommand } = useContext(SessionContext);
  const gameSettings = useAppSelector(gameSlice.selectors.settings);
  const [pending, setPending] = useState(false);
  const inputDisabled = !isHost || pending;

  // Set pending state and reset it after 1000ms
  // Used to temporarily disable inputs while waiting for server response
  const setPendingWithTimeout = () => {
    setPending(true);
    setTimeout(() => setPending(false), 1000);
  };

  const updateCallingMethod = (value: string) => {
    setPendingWithTimeout();
    sendCommand(newUpdateCallingMethodCommand({ callingMethod: value }));
  };

  const updateNoPickResolution = (value: string) => {
    setPendingWithTimeout();
    sendCommand(newUpdateNoPickResolutionCommand({ noPickResolution: value }));
  };

  const updateDoubleOnTheBump = (value: boolean) => {
    setPendingWithTimeout();
    sendCommand(newUpdateDoubleOnTheBumpCommand({ doubleOnTheBump: value }));
  };

  useEffect(() => {
    // Set pending state to false when settings are loaded
    if (gameSettings) {
      setPending(false);
    }
  }, [gameSettings]);

  return (
    <div className="GameSettingsForm">
      <Typography variant="h2">Game Settings</Typography>
      <div className="GameSettingsForm-Body">
        <div className="LabeledInput">
          <InputLabel margin="dense">Calling Method</InputLabel>
          <Select
            id="callingMethod"
            value={gameSettings.callingMethod}
            fullWidth
            disabled={inputDisabled}
            onChange={(event) => updateCallingMethod(event.target.value)}
          >
            {Object.values(CALLING_METHODS).map((option) => (
              <MenuItem key={option.ID} value={option.ID}>
                {option.LABEL}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="LabeledInput">
          <InputLabel margin="dense">No-Pick Method</InputLabel>
          <Select
            id="noPickResolution"
            value={gameSettings.noPickResolution}
            fullWidth
            disabled={inputDisabled}
            onChange={(event) => updateNoPickResolution(event.target.value)}
          >
            {Object.values(NO_PICK_RESOLUTIONS).map((option) => (
              <MenuItem key={option.ID} value={option.ID}>
                {option.LABEL}
              </MenuItem>
            ))}
          </Select>
        </div>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={gameSettings.doubleOnTheBump} />}
            onChange={(_, checked) => updateDoubleOnTheBump(checked)}
            label="Double on the Bump"
            disabled={inputDisabled}
          />
        </FormGroup>
        {!isHost && <i>Only the host can edit settings.</i>}
      </div>
    </div>
  );
}
