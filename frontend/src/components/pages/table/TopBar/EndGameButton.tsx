import CancelIcon from "@mui/icons-material/Cancel";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/commands";
import PaperButton from "../../../common/PaperButton";
import { AuthContext } from "../../auth/AuthContextProvider";
import { ChannelContext } from "../ChannelContextProvider";
import { TableState } from "../TablePage";

export default function EndGameButton() {
  const { hostId } = useContext(ChannelContext);
  const { sendCommand, handInProgress } = useContext(TableState);
  const { user } = useContext(AuthContext);

  const onClick = () => {
    sendCommand({ name: COMMAND_TYPES.END_GAME, data: undefined });
  };

  if (user?.uid !== hostId || !handInProgress) {
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
