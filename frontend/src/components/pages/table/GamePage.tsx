import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useAppSelector } from "../../../store/hooks";
import selectors from "../../../store/selectors";
import gameSlice from "../../../store/slices/game.slice";
import ExpandingButton from "../../common/ExpandingButton";
import Game from "./Game";
import GameMenu from "./GameMenu";
import "./GamePage.scss";
import Chat from "./SideBar/Chat/Chat";
import LinkButton from "./SideBar/LinkButton";
import ScoreboardDisplay from "./SideBar/ScoreboardDisplay";
import EndGameButton from "./TopBar/EndGameButton";
import ExitButton from "./TopBar/ExitButton";

export default function GamePage() {
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const isHost = useAppSelector(selectors.isHost);

  return (
    <div className="GamePage">
      <div id="top-left">
        <LinkButton />
      </div>
      <div id="bottom-left">
        <ExitButton />
        {inProgress && isHost && <EndGameButton />}
      </div>
      {inProgress && (
        <ExpandingButton
          id={"top-right"}
          title="Scoreboard"
          expandedIcon={<CloseIcon />}
          collapsedIcon={<FormatListNumberedIcon />}
        >
          <ScoreboardDisplay />
        </ExpandingButton>
      )}
      <ExpandingButton
        id={"bottom-right"}
        title="Chat"
        expandedIcon={<CloseIcon />}
        collapsedIcon={<ChatIcon />}
        defaultExpanded
      >
        <Chat />
      </ExpandingButton>
      {inProgress ? <Game /> : <GameMenu />}
    </div>
  );
}
