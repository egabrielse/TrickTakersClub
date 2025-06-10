import CancelIcon from "@mui/icons-material/Cancel";
import { useContext } from "react";
import { newEndGameCommand } from "../../../../utils/message";
import PaperButton from "../../../common/PaperButton";
import SessionContext from "../SessionContext";

export default function EndGameButton() {
  const { sendCommand } = useContext(SessionContext);

  const onClick = () => sendCommand(newEndGameCommand());

  return (
    <PaperButton
      id="end-game-button"
      onClick={onClick}
      startIcon={<CancelIcon />}
    >
      End Game
    </PaperButton>
  );
}
