import CancelIcon from "@mui/icons-material/Cancel";
import { useContext } from "react";
import { COMMAND_TYPES } from "../../../../constants/message";
import { useAppSelector } from "../../../../store/hooks";
import selectors from "../../../../store/selectors";
import gameSlice from "../../../../store/slices/game.slice";
import PaperButton from "../../../common/PaperButton";
import ConnectionContext from "../ConnectionContext";

export default function EndGameButton() {
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const { sendCommand } = useContext(ConnectionContext);
  const isHost = useAppSelector(selectors.isHost);

  const onClick = () => {
    sendCommand({ name: COMMAND_TYPES.END_GAME, data: undefined });
  };

  if (!isHost || !inProgress) {
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
