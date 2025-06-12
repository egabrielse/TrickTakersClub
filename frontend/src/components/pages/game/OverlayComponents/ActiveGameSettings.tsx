import { Typography } from "@mui/material";
import {
  CALLING_METHODS,
  NO_PICK_RESOLUTIONS,
} from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import gameSlice from "../../../../store/slices/game.slice";

export default function ActiveGameSettings() {
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const gameSettings = useAppSelector(gameSlice.selectors.settings);

  return inProgress && gameSettings ? (
    <div>
      <Typography variant="body1">
        {CALLING_METHODS[gameSettings.callingMethod].LABEL}
      </Typography>
      <Typography variant="body1">
        {NO_PICK_RESOLUTIONS[gameSettings.noPickResolution].LABEL}
      </Typography>
      {gameSettings.doubleOnTheBump && (
        <Typography variant="body1">Double on the Bump</Typography>
      )}
      {gameSettings.blitzing && (
        <Typography variant="body1">Blitzing</Typography>
      )}
      {gameSettings.cracking && (
        <Typography variant="body1">Cracking</Typography>
      )}
    </div>
  ) : null;
}
