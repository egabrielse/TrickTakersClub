import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Box, Typography } from "@mui/material";
import { CALLING_METHODS, NO_PICK_RESOLUTIONS } from "../../../constants/game";
import { useAppSelector } from "../../../store/hooks";
import selectors from "../../../store/selectors";
import gameSlice from "../../../store/slices/game.slice";
import tableSlice from "../../../store/slices/table.slice";
import AppLogo from "../../common/AppLogo";
import ExpandingButton from "../../common/ExpandingButton";
import Game from "./Game";
import GameMenu from "./GameMenu";
import Chat from "./OverlayComponents/Chat";
import EndGameButton from "./OverlayComponents/EndGameButton";
import ExitButton from "./OverlayComponents/ExitButton";
import ScoreboardDisplay from "./OverlayComponents/ScoreboardDisplay";
import "./TablePage.scss";

export default function TablePage() {
  const inProgress = useAppSelector(gameSlice.selectors.inProgress);
  const isHost = useAppSelector(selectors.isHost);
  const tableId = useAppSelector(tableSlice.selectors.tableId);
  const styledTableId = tableId.toUpperCase().split("-");
  const settings = useAppSelector(tableSlice.selectors.settings);

  return (
    <div className="TablePage">
      <div id="top-left">
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <AppLogo size="large" />
          <Typography variant="h6" sx={{ lineHeight: 0.75 }}>
            {styledTableId.map((line, index) => {
              const lastWord = index === styledTableId.length - 1;
              const nextWordIsShort = styledTableId[index + 1]?.length < 3;
              return (
                <span key={index}>
                  {line}
                  {!lastWord && !nextWordIsShort && <br />}
                  {nextWordIsShort && " "}
                </span>
              );
            })}
          </Typography>
        </Box>
        {inProgress && settings && (
          <>
            <Typography variant="body1" lineHeight={1}>
              {CALLING_METHODS[settings.callingMethod].LABEL.toUpperCase()}
            </Typography>
            <Typography variant="body1">
              {NO_PICK_RESOLUTIONS[
                settings.noPickResolution
              ].LABEL.toUpperCase()}
            </Typography>
          </>
        )}
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
