import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useContext, useEffect, useState } from "react";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import authSlice from "../../../../store/slices/auth.slice";
import handSlice from "../../../../store/slices/hand.slice";
import PaperButton from "../../../common/PaperButton";
import ConnectionContext from "../ConnectionContext";

export default function LastHandButton() {
  const [disabled, setDisabled] = useState(false);
  const uid = useAppSelector(authSlice.selectors.uid);
  const { sendCommand } = useContext(ConnectionContext);
  const lastHand = useAppSelector(handSlice.selectors.lastHand);
  const status = uid in lastHand ? lastHand[uid] : false;

  const onClick = () => {
    setDisabled(true);
    sendCommand({ name: COMMAND_TYPES.TOGGLE_LAST_HAND, data: undefined });
    setTimeout(() => setDisabled(false), 3000);
  };

  // Whenever the status changes, update the disabled state
  useEffect(() => setDisabled(false), [status]);

  return (
    <PaperButton
      id="last-hand-button"
      onClick={onClick}
      startIcon={status ? <PlayCircleIcon /> : <StopCircleIcon />}
      disabled={disabled}
    >
      {status ? "Keep Playing" : "Last Hand"}
    </PaperButton>
  );
}
