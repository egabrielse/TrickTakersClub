import CancelIcon from "@mui/icons-material/Cancel";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/message";
import PaperButton from "../../../common/PaperButton";
import ConnectionContext from "../ConnectionContext";

export default function EndGameButton() {
  const { sendCommand } = useContext(ConnectionContext);

  const onClick = () => {
    sendCommand({ name: COMMAND_TYPES.END_GAME, data: undefined });
  };

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
