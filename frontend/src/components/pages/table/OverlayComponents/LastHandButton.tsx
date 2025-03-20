import SportsScoreIcon from "@mui/icons-material/SportsScore";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useContext, useState } from "react";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import handSlice from "../../../../store/slices/hand.slice";
import PaperButton from "../../../common/PaperButton";
import ConnectionContext from "../ConnectionContext";

export default function LastHandButton() {
  const [disabled, setDisabled] = useState(false);
  const { sendCommand } = useContext(ConnectionContext);
  const isLastHand = useAppSelector(handSlice.selectors.isLastHand);

  const onClick = () => {
    setDisabled(true);
    sendCommand({ name: COMMAND_TYPES.CALL_LAST_HAND, data: undefined });
    setTimeout(() => setDisabled(false), 3000);
  };

  return (
    <PaperButton
      id="last-hand-button"
      onClick={onClick}
      startIcon={isLastHand ? <SportsScoreIcon /> : <StopCircleIcon />}
      disabled={disabled || isLastHand}
    >
      {isLastHand ? "Last Hand Called!" : "Last Hand"}
    </PaperButton>
  );
}
