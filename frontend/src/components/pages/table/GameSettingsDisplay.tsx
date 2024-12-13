import {
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Paper,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import {
  CALLING_METHODS,
  GAME_SETTINGS_DEFAULTS,
  GAME_SETTINGS_PARAMS,
  NO_PICK_RESOLUTIONS,
} from "../../../constants/game";
import { GameSettings } from "../../../types/game";
import { AuthContext } from "../auth/AuthContextProvider";
import { ChannelContext } from "./ChannelContextProvider";
import "./GameSettingsDisplay.scss";

export default function GameSettingsDisplay() {
  const { hostId } = useContext(ChannelContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<GameSettings>({
    autoDeal: GAME_SETTINGS_DEFAULTS.AUTO_DEAL,
    playerCount: GAME_SETTINGS_DEFAULTS.PLAYER_COUNT,
    callingMethod: GAME_SETTINGS_DEFAULTS.CALLING_METHOD,
    noPickResolution: GAME_SETTINGS_DEFAULTS.NO_PICK_RESOLUTION,
    doubleOnTheBump: GAME_SETTINGS_DEFAULTS.DOUBLE_ON_THE_BUMP,
    blitzing: GAME_SETTINGS_DEFAULTS.BLITZING,
    cracking: GAME_SETTINGS_DEFAULTS.CRACKING,
  });
  const { user } = useContext(AuthContext);
  const isHost = user?.uid === hostId;

  /**
   * Update the value of a setting
   * @param name key of the setting
   * @param value new value
   */
  const onChange = (
    name: string,
    value: number | number[] | string | boolean,
  ) => {
    setIsEditing(true);
    setValues((prev) => ({ ...prev!, [name]: value }));
  };

  /**
   * Send message to update game settings
   */
  const onSubmit = () => {
    setIsSubmitting(true);
    setIsEditing(false);
    // sendCommand(MESSAGE_TYPES.CREATE_GAME, values!);
  };

  return (
    <Paper className="GameSettingsDisplay">
      <Typography variant="h1">Game Settings</Typography>
      {values === null ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <div className="GameSettingsDisplay-Body">
            <div className="GameSettingsDisplay-Body-LabeledInput">
              <InputLabel margin="dense">Player Count</InputLabel>
              <Slider
                id="playerCount"
                value={values.playerCount}
                disabled={!isHost || isSubmitting}
                onChange={(_, value) => onChange("playerCount", value)}
                valueLabelDisplay="auto"
                min={GAME_SETTINGS_PARAMS.MIN_PLAYERS}
                max={GAME_SETTINGS_PARAMS.MAX_PLAYERS}
                marks={GAME_SETTINGS_PARAMS.SUPPORTED_PLAYER_COUNTS.map(
                  (value) => ({ value, label: value.toString() }),
                )}
              />
            </div>

            <div className="GameSettingsDisplay-Body-LabeledInput">
              <InputLabel margin="dense">Calling Method</InputLabel>
              <ToggleButtonGroup
                id="callingMethod"
                exclusive
                disabled={!isHost || isSubmitting}
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

            <div className="GameSettingsDisplay-Body-LabeledInput">
              <InputLabel margin="dense">No-Pick Resolution</InputLabel>
              <ToggleButtonGroup
                id="noPickResolution"
                exclusive
                disabled={!isHost || isSubmitting}
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
            <div className="GameSettingsDisplay-Body-LabeledInput">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <FormControlLabel
                  id="doubleOnTheBump"
                  name="doubleOnTheBump"
                  disabled={!isHost || isSubmitting}
                  value={values.doubleOnTheBump}
                  onChange={(_, checked) =>
                    onChange("doubleOnTheBump", checked)
                  }
                  control={<Checkbox checked={values.doubleOnTheBump} />}
                  label="Double on the Bump"
                />
                <FormControlLabel
                  id="blitzing"
                  name="blitzing"
                  disabled={!isHost || isSubmitting}
                  value={values.blitzing}
                  onChange={(_, checked) => onChange("blitzing", checked)}
                  control={<Checkbox checked={values.blitzing} />}
                  label="Blitzing"
                />
              </div>
            </div>
          </div>
          {isHost && (
            <div className="GameSettingsDisplay-Footer">
              <Button
                disabled={!isEditing}
                onClick={onSubmit}
                variant="contained"
              >
                Confirm
              </Button>
            </div>
          )}
        </>
      )}
    </Paper>
  );
}
