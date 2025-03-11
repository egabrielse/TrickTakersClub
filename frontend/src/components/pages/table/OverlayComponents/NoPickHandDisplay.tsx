import { Paper, Typography } from "@mui/material";
import { useAppSelector } from "../../../../store/hooks";
import tableSlice from "../../../../store/slices/table.slice";
import SlideTransition from "../../../common/SlideTransition";
import "./NoPickHandDisplay.scss";

export default function NoPickHandDisplay() {
  const settings = useAppSelector(tableSlice.selectors.settings);

  return (
    <SlideTransition dir="down" in>
      <Paper className="NoPickHandDisplay">
        <Typography variant="h6">
          {settings.noPickResolution.toUpperCase()} HAND
        </Typography>
      </Paper>
    </SlideTransition>
  );
}
