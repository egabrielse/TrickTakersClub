import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { useAppSelector } from "../../../store/hooks";
import selectors from "../../../store/selectors";
import gameSlice from "../../../store/slices/game.slice";
import ExpandingButton from "../../common/ExpandingButton";
import Game from "./Game";
import GameMenu from "./GameMenu";
import ActiveGameSettings from "./OverlayComponents/ActiveGameSettings";
import Chat from "./OverlayComponents/Chat";
import EndGameButton from "./OverlayComponents/EndGameButton";
import LastHandButton from "./OverlayComponents/LastHandButton";
import ScoreboardDisplay from "./OverlayComponents/ScoreboardDisplay";
import TableHeader from "./OverlayComponents/TableHeader";
import "./TablePage.scss";

export default function TablePage() {
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const isHost = useAppSelector(selectors.isHost);

  return (
    <div className="TablePage">
      {inProgress ? <Game /> : <GameMenu />}
      <div id="top-left">
        <TableHeader />
        <ActiveGameSettings />
      </div>
      <div id="bottom-left">
        {inProgress && isHost && <EndGameButton />}
        {inProgress && <LastHandButton />}
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
    </div>
  );
}
