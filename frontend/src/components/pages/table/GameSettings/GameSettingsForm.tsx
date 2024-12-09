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
import { useFormik } from "formik";
import * as yup from "yup";
import {
  CALLING_METHODS,
  GAME_DEFAULTS,
  NO_PICK_RESOLUTIONS,
} from "../../../../constants/game";
import { GameSettings } from "../../../../types/game";
import "./GameSettingsForm.scss";

const validationSchema = yup.object({
  playerCount: yup.number().integer().required(),
  callingMethod: yup.string().required().oneOf(Object.values(CALLING_METHODS)),
  noPickResolution: yup
    .string()
    .required()
    .oneOf(Object.values(NO_PICK_RESOLUTIONS)),
  doubleOnTheBump: yup.boolean().required(),
  blitzing: yup.boolean().required(),
});

type GameSettingsFormProps = {
  defaults: GameSettings;
  onSubmit: (values: GameSettings) => void;
};

// TODO: this form could be generalized for use in other contexts
export default function GameSettingsForm({
  defaults,
  onSubmit,
}: GameSettingsFormProps) {
  const formik = useFormik({
    initialValues: {
      playerCount: defaults.playerCount,
      callingMethod: defaults.callingMethod,
      noPickResolution: defaults.noPickResolution,
      doubleOnTheBump: defaults.doubleOnTheBump,
      blitzing: defaults.blitzing,
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <form className="GameSettingsForm" onSubmit={formik.handleSubmit}>
      <Typography variant="h2">Game Settings</Typography>
      <div className="LabeledInput">
        {" "}
        <InputLabel margin="dense">Player Count</InputLabel>
        <Slider
          id="playerCount"
          name="playerCount"
          value={formik.values.playerCount}
          onChange={(_, value) => formik.setFieldValue("playerCount", value)}
          valueLabelDisplay="auto"
          min={GAME_DEFAULTS.MIN_PLAYERS}
          max={GAME_DEFAULTS.MAX_PLAYERS}
          marks={[
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 6, label: "6" },
            { value: 7, label: "7" },
          ]}
        />
      </div>

      <div className="LabeledInput">
        <InputLabel margin="dense">Calling Method</InputLabel>
        <ToggleButtonGroup
          exclusive
          id="callingMethod"
          onBlur={formik.handleBlur}
          value={formik.values.callingMethod}
          onChange={(e, value) => {
            if (value) {
              formik.setFieldValue("callingMethod", value);
            }
          }}
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
          exclusive
          id="noPickResolution"
          onBlur={formik.handleBlur}
          value={formik.values.noPickResolution}
          onChange={(e, value) => {
            if (value) {
              formik.setFieldValue("noPickResolution", value);
            }
          }}
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
            value={formik.values.doubleOnTheBump}
            onChange={formik.handleChange}
            control={<Checkbox />}
            label="Double on the Bump"
          />
          <FormControlLabel
            id="blitzing"
            name="blitzing"
            value={formik.values.blitzing}
            onChange={formik.handleChange}
            control={<Checkbox />}
            label="Blitzing"
          />
        </div>
      </div>
      <Button color="primary" variant="contained" fullWidth type="submit">
        Submit
      </Button>
    </form>
  );
}
