import { Typography } from "@mui/material";
import {
  CALLING_METHODS,
  NO_PICK_RESOLUTIONS,
} from "../../../../constants/game";
import { useAppSelector } from "../../../../store/hooks";
import gameSlice from "../../../../store/slices/game.slice";
import tableSlice from "../../../../store/slices/table.slice";

export default function ActiveGameSettings() {
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const settings = useAppSelector(tableSlice.selectors.settings);

  return inProgress && settings ? (
    <div>
      <Typography variant="body1" lineHeight={1}>
        {CALLING_METHODS[settings.callingMethod].LABEL}
      </Typography>
      <Typography variant="body1">
        {NO_PICK_RESOLUTIONS[settings.noPickResolution].LABEL}
      </Typography>
      {settings.doubleOnTheBump && (
        <Typography variant="body1">Double on the Bump</Typography>
      )}
      {settings.blitzing && <Typography variant="body1">Blitzing</Typography>}
      {settings.cracking && <Typography variant="body1">Cracking</Typography>}
    </div>
  ) : null;
}
