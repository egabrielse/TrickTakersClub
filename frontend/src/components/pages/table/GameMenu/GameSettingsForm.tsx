import { InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  CALLING_METHODS,
  NO_PICK_RESOLUTIONS,
} from "../../../../constants/game";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import tableSlice from "../../../../store/slices/table.slice";
import ConnectionContext from "../ConnectionContext";
import "./GameSettingsForm.scss";

export default function GameSettingsForm() {
  const isHost = useAppSelector(selectors.isHost);
  const { sendCommand } = useContext(ConnectionContext);
  const settings = useAppSelector(tableSlice.selectors.settings);
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
    sendCommand({
      name: COMMAND_TYPES.UPDATE_CALLING_METHOD,
      data: { callingMethod: value },
    });
  };

  const updateNoPickResolution = (value: string) => {
    setPendingWithTimeout();
    sendCommand({
      name: COMMAND_TYPES.UPDATE_NO_PICK_RESOLUTION,
      data: { noPickResolution: value },
    });
  };

  useEffect(() => {
    // Set pending state to false when settings are loaded
    if (settings) {
      setPending(false);
    }
  }, [settings]);

  return (
    <div className="GameSettingsForm">
      <Typography variant="h2">Game Settings</Typography>
      <div className="GameSettingsForm-Body">
        <div className="LabeledInput">
          <InputLabel margin="dense">Calling Method</InputLabel>
          <Select
            id="callingMethod"
            value={settings.callingMethod}
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
          <InputLabel margin="dense">No-Pick Resolution</InputLabel>
          <Select
            id="noPickResolution"
            value={settings.noPickResolution}
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
      </div>
    </div>
  );
}
