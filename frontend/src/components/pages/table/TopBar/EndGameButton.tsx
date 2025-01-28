import CancelIcon from "@mui/icons-material/Cancel";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/message";
import PaperButton from "../../../common/PaperButton";
import { AuthContext } from "../../auth/AuthContextProvider";
import { ConnectionContext } from "../ConnectionProvider";
import { TableState } from "../TableStateProvider";

export default function EndGameButton() {
  const { hostId } = useContext(ConnectionContext);
  const { sendCommand, inProgress } = useContext(TableState);
  const { user } = useContext(AuthContext);

  const onClick = () => {
    sendCommand({ name: COMMAND_TYPES.END_GAME, data: undefined });
  };

  if (user?.uid !== hostId || !inProgress) {
    // Empty div to maintain layout consistency
    return <div></div>;
  } else {
    return (
      <PaperButton onClick={onClick} startIcon={<CancelIcon />}>
        End Game
      </PaperButton>
    );
  }
}
