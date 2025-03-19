import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { selectIsHost } from "../../../store/selectors";
import gameSlice from "../../../store/slices/game.slice";
import tableSlice from "../../../store/slices/table.slice";
import ExpandingButton from "../../common/ExpandingButton";
import Game from "./Game";
import GameMenu from "./GameMenu";
import ActiveGameSettings from "./OverlayComponents/ActiveGameSettings";
import Chat from "./OverlayComponents/Chat";
import EndGameButton from "./OverlayComponents/EndGameButton";
import LastHandButton from "./OverlayComponents/LastHandButton";
import ScoreboardDisplay from "./OverlayComponents/ScoreboardDisplay";
import SoundButton from "./OverlayComponents/SoundButton";
import TableHeader from "./OverlayComponents/TableHeader";
import "./TablePage.scss";

export default function TablePage() {
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const isHost = useAppSelector(selectIsHost);
  const scoreboard = useAppSelector(gameSlice.selectors.scoreboard);
  const chatLength = useAppSelector(tableSlice.selectors.chatLength);
  const [chatExpanded, setChatExpanded] = useState(true);
  const [countMissedMessages, setCountMissedMessages] = useState(0);

  const onChatToggled = (expanded: boolean) => {
    setChatExpanded(expanded);
    if (!expanded) {
      // If the user closes the chat, record how many messages they last viewed
      setCountMissedMessages(chatLength);
    }
  };

  return (
    <div className="TablePage">
      {inProgress ? <Game /> : <GameMenu />}
      <div id="top-left">
        <TableHeader />
        <ActiveGameSettings />
      </div>
      <div id="bottom-left">
        {inProgress && <SoundButton />}
        {inProgress && isHost && <EndGameButton />}
        {inProgress && <LastHandButton />}
      </div>
      {inProgress && (
        <ExpandingButton
          id={"top-right"}
          title="Scoreboard"
          notification={2}
          expandedIcon={<CloseIcon />}
          collapsedIcon={<FormatListNumberedIcon />}
        >
          <ScoreboardDisplay scoreboard={scoreboard} />
        </ExpandingButton>
      )}
      <ExpandingButton
        id={"bottom-right"}
        title="Chat"
        expandedIcon={<CloseIcon />}
        collapsedIcon={<ChatIcon />}
        notification={
          !chatExpanded ? chatLength - countMissedMessages : undefined
        }
        onToggleExpanded={onChatToggled}
        defaultExpanded
      >
        <Chat />
      </ExpandingButton>
    </div>
  );
}
