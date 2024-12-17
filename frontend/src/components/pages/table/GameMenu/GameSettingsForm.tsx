import {
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { COMMAND_TYPES } from "../../../../constants/commands";
import {
  CALLING_METHODS,
  GAME_SETTINGS_DEFAULTS,
  GAME_SETTINGS_PARAMS,
  NO_PICK_RESOLUTIONS,
} from "../../../../constants/game";
import { GameSettings } from "../../../../types/game";
import { AuthContext } from "../../auth/AuthContextProvider";
import { ChannelContext } from "../ChannelContextProvider";
import { TableState } from "../TablePage";
import "./GameSettingsForm.scss";

const DefaultGameSettings: GameSettings = {
  autoDeal: GAME_SETTINGS_DEFAULTS.AUTO_DEAL,
  playerCount: GAME_SETTINGS_DEFAULTS.PLAYER_COUNT,
  callingMethod: GAME_SETTINGS_DEFAULTS.CALLING_METHOD,
  noPickResolution: GAME_SETTINGS_DEFAULTS.NO_PICK_RESOLUTION,
  doubleOnTheBump: GAME_SETTINGS_DEFAULTS.DOUBLE_ON_THE_BUMP,
  blitzing: GAME_SETTINGS_DEFAULTS.BLITZING,
};

export default function GameSettingsForm() {
  const { user } = useContext(AuthContext);
  const { hostId } = useContext(ChannelContext);
  const { sendCommand, gameInProgress, gameSettings } = useContext(TableState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<GameSettings>(DefaultGameSettings);
  const isHost = user?.uid === hostId;
  const inputDisabled = !isHost || isSubmitting || gameInProgress;

  const onChange = (
    name: string,
    value: number | number[] | string | boolean,
  ) => {
    setValues((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    sendCommand({
      name: COMMAND_TYPES.CREATE_GAME,
      data: values,
    });
  };

  const handleCancel = () => {
    sendCommand({
      name: COMMAND_TYPES.END_GAME,
      data: undefined,
    });
  };

  useEffect(() => {
    setIsSubmitting(false);
    if (gameSettings) {
      setValues(gameSettings);
    }
  }, [gameSettings]);

  return (
    <div className="GameSettingsForm">
      <Typography variant="h1">Game Settings</Typography>
      <div className="GameSettingsForm-Body">
        <div className="LabeledInput">
          <InputLabel margin="dense">Player Count</InputLabel>
          <Slider
            id="playerCount"
            value={values.playerCount}
            disabled={inputDisabled}
            onChange={(_, value) => onChange("playerCount", value)}
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
          <ToggleButtonGroup
            id="callingMethod"
            exclusive
            disabled={inputDisabled}
            value={values.callingMethod}
            onChange={(_, value) => onChange("callingMethod", value)}
          >
            {Object.values(CALLING_METHODS).map((callingMethod) => (
              <ToggleButton key={callingMethod} value={callingMethod}>
                {callingMethod}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <div className="LabeledInput">
          <InputLabel margin="dense">No-Pick Resolution</InputLabel>
          <ToggleButtonGroup
            id="noPickResolution"
            exclusive
            disabled={inputDisabled}
            value={values.noPickResolution}
            onChange={(_, value) => onChange("noPickResolution", value)}
          >
            {Object.values(NO_PICK_RESOLUTIONS).map((noPickResolution) => (
              <ToggleButton key={noPickResolution} value={noPickResolution}>
                {noPickResolution}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        <div className="LabeledInput">
          <InputLabel margin="dense">Scoring Rules</InputLabel>
          <div className="Row">
            <FormControlLabel
              id="doubleOnTheBump"
              name="doubleOnTheBump"
              disabled={inputDisabled}
              value={values.doubleOnTheBump}
              onChange={(_, checked) => onChange("doubleOnTheBump", checked)}
              control={<Checkbox checked={values.doubleOnTheBump} />}
              label="Double on the Bump"
            />
            <FormControlLabel
              id="blitzing"
              name="blitzing"
              disabled={inputDisabled}
              value={values.blitzing}
              onChange={(_, checked) => onChange("blitzing", checked)}
              control={<Checkbox checked={values.blitzing} />}
              label="Blitzing"
            />
          </div>
        </div>
      </div>
      {isHost && (
        <div className="GameSettingsForm-Footer">
          {gameInProgress ? (
            <Button color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Create Game</Button>
          )}
        </div>
      )}
    </div>
  );
}
