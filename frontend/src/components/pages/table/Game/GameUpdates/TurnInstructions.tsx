import { Typography } from "@mui/material";
import { HAND_PHASE } from "../../../../../constants/game";
import { useAppSelector } from "../../../../../store/hooks";
import handSlice from "../../../../../store/slices/hand.slice";

export default function TurnInstructions() {
  const blindSize = useAppSelector(handSlice.selectors.blindSize);
  const phase = useAppSelector(handSlice.selectors.phase);

  return (
    <Typography component="span" variant="body1">
      Your Turn!&nbsp;
      {phase === HAND_PHASE.PICK
        ? "Pick or pass on the blind"
        : phase === HAND_PHASE.CALL
          ? "Call a card or go it alone"
          : phase === HAND_PHASE.BURY
            ? `Pick ${blindSize} cards to bury`
            : phase === HAND_PHASE.PLAY
              ? "Play a card"
              : null}
    </Typography>
  );
}
