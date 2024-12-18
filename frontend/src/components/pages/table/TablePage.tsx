import LogoutIcon from "@mui/icons-material/Logout";
import { Message } from "ably";
import { useChannel, usePresence } from "ably/react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { HAND_PHASES } from "../../../constants/game";
import { MESSAGE_TYPES } from "../../../constants/message";
import { PATHS } from "../../../constants/url";
import { TypedCommand } from "../../../types/command";
import {
  GameSettings,
  HandPhase,
  PlayingCard,
  Scoreboard,
  TrickState,
} from "../../../types/game";
import { TypedMessage } from "../../../types/message";
import PaperButton from "../../common/PaperButton";
import { DialogContext } from "../../dialog/DialogProvider";
import LoadingPage from "../loading/LoadingPage";
import { ChannelContext } from "./ChannelContextProvider";
import Game from "./Game/Game";
import GameMenu from "./GameMenu/GameMenu";
import Chat from "./SideBar/Chat/Chat";
import LinkButton from "./SideBar/LinkButton";
import ScoreboardDisplay from "./SideBar/ScoreboardDisplay";
import "./TablePage.scss";
import EndGameButton from "./TopBar/EndGameButton";
import UpNextIndicator from "./TopBar/UpNextIndicator";
import useGameState from "./useGameState";

export const TableState = createContext<{
  sendChatMessage: (message: string) => void;
  sendCommand: (command: TypedCommand) => void;
  chatMessages: Message[];
  gameInProgress: boolean;
  dealerIndex: number;
  playerOrder: string[];
  gameSettings: GameSettings | null;
  scoreboard: Scoreboard | null;
  handInProgress: boolean;
  cardsInBlind: number;
  calledCard: PlayingCard | null;
  pickerId: string | null;
  partnerId: string | null;
  tricks: TrickState[];
  phase: HandPhase;
  upNextId: string;
  playerHand: PlayingCard[];
  playerBury: PlayingCard[];
}>({
  sendChatMessage: () => {},
  sendCommand: () => {},
  chatMessages: [],
  gameInProgress: false,
  dealerIndex: 0,
  playerOrder: [],
  gameSettings: null,
  scoreboard: {},
  handInProgress: false,
  cardsInBlind: 0,
  calledCard: null,
  pickerId: null,
  partnerId: null,
  tricks: [],
  phase: HAND_PHASES.PICK,
  upNextId: "",
  playerHand: [],
  playerBury: [],
});

export default function TablePage() {
  // ### Contexts ###
  const { tableId, broadcastChannelName, directMessageChannelName } =
    useContext(ChannelContext);
  const { openDialog } = useContext(DialogContext);
  const navigate = useNavigate();
  // ### Table State ###
  const [loaded, setLoaded] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  // ### Game State ###
  const state = useGameState();

  // Enter the public channel presence
  usePresence(broadcastChannelName);

  /**
   * Handles incoming messages from the ably channels
   * @param msg message from the ably channel
   */
  const incomingMessageHandler = (msg: TypedMessage) => {
    switch (msg.name) {
      case MESSAGE_TYPES.CHAT:
        setChatMessages((prev) => [...prev, msg]);
        break;
      case MESSAGE_TYPES.TIMEOUT:
        openDialog({
          type: DIALOG_TYPES.ERROR,
          closeable: false,
          props: {
            title: "Timeout Due to Inactivity",
            message: "The table was inactive for too long.",
          },
        });
        break;
      case MESSAGE_TYPES.REFRESH:
        setLoaded(true);
        state.handleRefreshMessage(msg);
        break;
      case MESSAGE_TYPES.SAT_DOWN:
        state.handleSatDownMessage(msg);
        break;
      case MESSAGE_TYPES.STOOD_UP:
        state.handleStoodUpMessage(msg);
        break;
      case MESSAGE_TYPES.NEW_GAME:
        state.handleNewGameMessage(msg);
        break;
      case MESSAGE_TYPES.GAME_STARTED:
        state.handleGameStartedMessage(msg);
        break;
      case MESSAGE_TYPES.GAME_OVER:
        state.handleGameOverMessage();
        break;
      case MESSAGE_TYPES.DEAL_HAND:
        state.handleDealHandMessage(msg);
        break;
      case MESSAGE_TYPES.UP_NEXT:
        state.handleUpNextMessage(msg);
        break;
      case MESSAGE_TYPES.PICK:
        state.handlePickMessage(msg);
        break;
      default:
        console.warn("Unhandled message type", msg);
        break;
    }
  };

  // Public channel
  const broadcastChannel = useChannel(broadcastChannelName, (msg) =>
    incomingMessageHandler(msg as TypedMessage),
  );

  // Private channel
  const directMessageChannel = useChannel(directMessageChannelName, (msg) =>
    incomingMessageHandler(msg as TypedMessage),
  );

  /**
   * Sends a chat message to other players
   * @param data
   */
  const sendChatMessage = (message: string) => {
    broadcastChannel.publish(MESSAGE_TYPES.CHAT, message);
  };

  /**
   * Send a command to the service over the private channel
   * @param name
   * @param data
   */
  const sendCommand = ({ name, data }: TypedCommand) => {
    directMessageChannel.publish(name, data);
  };

  /**
   * Leave the table and navigate back to the home page
   */
  const handleLeaveTable = () => navigate(PATHS.HOME);

  const value = {
    sendChatMessage,
    sendCommand,
    chatMessages,
    ...state,
  };

  return loaded ? (
    <TableState.Provider value={value}>
      <div className="TablePage">
        <div className="TablePage-TopBar">
          <PaperButton
            onClick={handleLeaveTable}
            startIcon={<LogoutIcon style={{ transform: "rotate(180deg)" }} />}
          >
            Exit
          </PaperButton>
          <UpNextIndicator />
          <EndGameButton />
        </div>
        <div className="TablePage-Main">
          {state.gameInProgress && state.handInProgress ? (
            <Game />
          ) : (
            <GameMenu />
          )}
        </div>
        <div className="TablePage-SideBar">
          <LinkButton tableId={tableId} />
          <ScoreboardDisplay />
          <Chat />
        </div>
      </div>
    </TableState.Provider>
  ) : (
    <LoadingPage />
  );
}
