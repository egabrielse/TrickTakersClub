import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectIsHost } from "../../../store/selectors";
import gameSlice from "../../../store/slices/game.slice";
import sessionSlice from "../../../store/slices/session.slice";
import settingsSlice from "../../../store/slices/settings.slice";
import ExpandingButton from "../../common/ExpandingButton";
import HeaderLogo from "../../common/HeaderLogo";
import SlideTransition from "../../common/SlideTransition";
import LoadingOverlay from "../loading/LoadingOverlay";
import Game from "./Game";
import GameMenu from "./GameMenu";
import LinkButton from "./GameMenu/LinkButton";
import "./GamePage.scss";
import ActiveGameSettings from "./OverlayComponents/ActiveGameSettings";
import Chat from "./OverlayComponents/Chat";
import EndGameButton from "./OverlayComponents/EndGameButton";
import LastHandButton from "./OverlayComponents/LastHandButton";
import ScoreboardDisplay from "./OverlayComponents/ScoreboardDisplay";
import SoundButton from "./OverlayComponents/SoundButton";
import useMessageHandler from "./useMessageHandler";

export default function GamePage() {
  const dispatch = useAppDispatch();
  const { snackError, connected, clearSnackError } = useMessageHandler();
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const scoreboard = useAppSelector(gameSlice.selectors.scoreboard);
  const chatLength = useAppSelector(sessionSlice.selectors.chatLength);
  const chatOpen = useAppSelector(settingsSlice.selectors.chatOpen);
  const isHost = useAppSelector(selectIsHost);

  const [seenMessageCount, setSeenMessageCount] = useState(
    !chatOpen ? chatLength : 0,
  );
  const onToggleChat = (expanded: boolean) => {
    // Update the chatOpen setting
    dispatch(
      settingsSlice.actions.asyncUpdateSettings({
        chatOpen: expanded,
      }),
    );
    // If the user closes the chat, record how many messages they last saw
    if (!expanded) {
      setSeenMessageCount(chatLength);
    }
  };

  if (!connected) {
    return <LoadingOverlay text="Joining session" trailingEllipsis />;
  } else {
    return (
      <>
        <div className="GamePage">
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
            onToggle={onToggleChat}
            defaultExpanded={chatOpen}
          >
            <Chat />
          </ExpandingButton>
        </div>
        <Snackbar
          open={snackError !== ""}
          onClose={clearSnackError}
          TransitionComponent={SlideTransition}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert variant="filled" severity="error" onClose={clearSnackError}>
            {snackError}
          </Alert>
        </Snackbar>
      </>
    );
  }
}
