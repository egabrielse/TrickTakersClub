import { useContext } from "react";
import LoadingPage from "../loading/LoadingPage";
import Game from "./Game/Game";
import GameMenu from "./GameMenu/GameMenu";
import Chat from "./SideBar/Chat/Chat";
import LinkButton from "./SideBar/LinkButton";
import ScoreboardDisplay from "./SideBar/ScoreboardDisplay";
import "./TablePage.scss";
import { TableState } from "./TableStateProvider";
import EndGameButton from "./TopBar/EndGameButton";
import ExitButton from "./TopBar/ExitButton";
import UpNextIndicator from "./TopBar/UpNextIndicator";

export default function TablePage() {
  const { loaded, inProgress } = useContext(TableState);

  return loaded ? (
    <div className="TablePage">
      <div className="TablePage-TopBar">
        <ExitButton />
        <UpNextIndicator />
        <EndGameButton />
      </div>
      <div className="TablePage-Main">
        {inProgress ? <Game /> : <GameMenu />}
      </div>
      <div className="TablePage-SideBar">
        <LinkButton />
        <ScoreboardDisplay />
        <Chat />
      </div>
    </div>
  ) : (
    <LoadingPage />
  );
}
