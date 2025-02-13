import {
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  CALLING_METHODS,
  GAME_SETTINGS_PARAMS,
  NO_PICK_RESOLUTIONS,
} from "../../../../constants/game";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import tableSlice from "../../../../store/slices/table.slice";
import ConnectionContext from "../ConnectionContext";
import "./GameSettingsForm.scss";

const CallingMethodOptions = [
  {
    value: CALLING_METHODS.CALL_AN_ACE,
    label: "Call an Ace",
  },
  {
    value: CALLING_METHODS.JACK_OF_DIAMONDS,
    label: "Jack of Diamonds",
  },
  {
    value: CALLING_METHODS.CUT_THROAT,
    label: "Cut Throat",
  },
];

const NoPickResolutionOptions = [
  {
    value: NO_PICK_RESOLUTIONS.SCREW_THE_DEALER,
    label: "Screw the Dealer",
  },
  {
    value: NO_PICK_RESOLUTIONS.LEASTERS,
    label: "Leasters",
  },
  {
    value: NO_PICK_RESOLUTIONS.MOSTERS,
    label: "Mosters",
  },
];

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

  const updatePlayerCount = (value: number) => {
    setPendingWithTimeout();
    sendCommand({
      name: COMMAND_TYPES.UPDATE_PLAYER_COUNT,
      data: { playerCount: value },
    });
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
      <Typography variant="h1">Game Settings</Typography>
      <div className="GameSettingsForm-Body">
        <div className="LabeledInput">
          <InputLabel margin="dense">Player Count</InputLabel>
          <Slider
            id="playerCount"
            value={settings.playerCount}
            disabled={inputDisabled}
            onChange={(_, value) => updatePlayerCount(value as number)}
            valueLabelDisplay="auto"
            min={GAME_SETTINGS_PARAMS.MIN_PLAYERS}
            max={GAME_SETTINGS_PARAMS.MAX_PLAYERS}
            marks={GAME_SETTINGS_PARAMS.SUPPORTED_PLAYER_COUNTS.map(
              (value) => ({ value, label: value.toString() }),
            )}
          />
        </div>

        <div className="LabeledInput">
          <InputLabel margin="dense">Calling Method</InputLabel>
          <Select
            id="callingMethod"
            value={settings.callingMethod}
            fullWidth
            disabled={inputDisabled}
            onChange={(event) => updateCallingMethod(event.target.value)}
          >
            {CallingMethodOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
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
            {NoPickResolutionOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
