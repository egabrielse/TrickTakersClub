import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectIsHost } from "../../../store/selectors";
import gameSlice from "../../../store/slices/game.slice";
import settingsSlice from "../../../store/slices/settings.slice";
import tableSlice from "../../../store/slices/table.slice";
import ExpandingButton from "../../common/ExpandingButton";
import HeaderLogo from "../../common/HeaderLogo";
import Game from "./Game";
import GameMenu from "./GameMenu";
import LinkButton from "./GameMenu/LinkButton";
import ActiveGameSettings from "./OverlayComponents/ActiveGameSettings";
import Chat from "./OverlayComponents/Chat";
import EndGameButton from "./OverlayComponents/EndGameButton";
import LastHandButton from "./OverlayComponents/LastHandButton";
import ScoreboardDisplay from "./OverlayComponents/ScoreboardDisplay";
import SoundButton from "./OverlayComponents/SoundButton";
import "./TablePage.scss";

export default function TablePage() {
  const dispatch = useAppDispatch();
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const isHost = useAppSelector(selectIsHost);
  const scoreboard = useAppSelector(gameSlice.selectors.scoreboard);
  const chatLength = useAppSelector(tableSlice.selectors.chatLength);
  const settings = useAppSelector(settingsSlice.selectors.settings);
  const { chatOpen } = settings;
  const [seenMessageCount, setSeenMessageCount] = useState(
    !chatOpen ? chatLength : 0,
  );

  const onChatToggled = (expanded: boolean) => {
    // Update the chatOpen setting
    dispatch(
      settingsSlice.actions.asyncUpdateSettings({
        ...settings,
        chatOpen: expanded,
      }),
    );
    // If the user closes the chat, record how many messages they last saw
    if (!expanded) {
      setSeenMessageCount(chatLength);
    }
  };

  return (
    <div className="TablePage">
      {inProgress ? <Game /> : <GameMenu />}
      <div id="top-left">
        <HeaderLogo />
        <ActiveGameSettings />
      </div>
      <div id="bottom-left">
        {inProgress && <SoundButton />}
        {inProgress && isHost && <EndGameButton />}
        {inProgress && <LastHandButton />}
        {inProgress && <LinkButton variant="paper" />}
      </div>
      {inProgress && (
        <ExpandingButton
          id={"top-right"}
          title="Scoreboard"
          tooltip="Scoreboard"
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
        notification={!chatOpen ? chatLength - seenMessageCount : undefined}
        onToggleExpanded={onChatToggled}
        defaultExpanded={chatOpen}
      >
        <Chat />
      </ExpandingButton>
    </div>
  );
}
