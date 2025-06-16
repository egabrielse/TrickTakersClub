import { Paper, Typography } from "@mui/material";
import { useAppSelector } from "../../../../store/hooks";
import gameSlice from "../../../../store/slices/game.slice";
import SlideTransition from "../../../common/SlideTransition";
import "./NoPickHandDisplay.scss";

export default function NoPickHandDisplay() {
  const gameSettings = useAppSelector(gameSlice.selectors.settings);

  return (
    <SlideTransition dir="down" in>
      <Paper className="NoPickHandDisplay">
        <Typography variant="h6">
          {gameSettings.noPickResolution.toUpperCase()} HAND
        </Typography>
      </Paper>
    </SlideTransition>
  );
}
