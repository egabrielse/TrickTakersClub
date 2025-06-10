import SportsScoreIcon from "@mui/icons-material/SportsScore";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useContext, useState } from "react";
import { useAppSelector } from "../../../../store/hooks";
import handSlice from "../../../../store/slices/hand.slice";
import { newCallLastHandCommand } from "../../../../utils/message";
import PaperButton from "../../../common/PaperButton";
import SessionContext from "../SessionContext";

export default function LastHandButton() {
  const [disabled, setDisabled] = useState(false);
  const { sendCommand } = useContext(SessionContext);
  const isLastHand = useAppSelector(handSlice.selectors.isLastHand);

  const onClick = () => {
    setDisabled(true);
    sendCommand(newCallLastHandCommand());
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
