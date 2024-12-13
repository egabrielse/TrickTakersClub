import LogoutIcon from "@mui/icons-material/Logout";
import { Button } from "@mui/material";
import { Message } from "ably";
import { useChannel, usePresence } from "ably/react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { COMMAND_TYPES } from "../../../constants/commands";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { MESSAGE_TYPES } from "../../../constants/message";
import { PATHS } from "../../../constants/url";
import { TypedCommand } from "../../../types/command";
import { GameSettings } from "../../../types/game";
import { TypedMessage } from "../../../types/message";
import PaperButton from "../../common/PaperButton";
import { DialogContext } from "../../dialog/DialogProvider";
import { AuthContext } from "../auth/AuthContextProvider";
import LoadingPage from "../loading/LoadingPage";
import { ChannelContext } from "./ChannelContextProvider";
import Chat from "./Chat/Chat";
import GameMenu from "./GameMenu/GameMenu";
import LinkButton from "./LinkButton";
import "./TablePage.scss";

export const TableState = createContext<{
  sendChatMessage: (message: string) => void;
  sendCommand: (command: TypedCommand) => void;
  chatMessages: Message[];
  initialized: boolean;
  inProgress: boolean;
  playerOrder: string[];
  settings: GameSettings | null;
}>({
  sendChatMessage: () => {},
  sendCommand: () => {},
  chatMessages: [],
  initialized: false,
  inProgress: false,
  playerOrder: [],
  settings: null,
});

export default function TablePage() {
  // ### Contexts ###
  const { tableId, broadcastChannelName, directMessageChannelName } =
    useContext(ChannelContext);
  const { openDialog } = useContext(DialogContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // ### State ###
  const [loaded, setLoaded] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

  // Enter the public channel presence
  usePresence(broadcastChannelName);

  const broadcastChannelHandler = (msg: TypedMessage) => {
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
      case MESSAGE_TYPES.SAT_DOWN:
        setPlayerOrder((prev) => [...prev, msg.data]);
        break;
      case MESSAGE_TYPES.STOOD_UP:
        setPlayerOrder((prev) => prev.filter((player) => player !== msg.data));
        break;
      case MESSAGE_TYPES.NEW_GAME:
        setInitialized(true);
        setInProgress(false);
        setGameSettings(msg.data.settings);
        setPlayerOrder(msg.data.playerOrder);
        break;
      case MESSAGE_TYPES.GAME_STARTED:
        // TODO: more setup
        setInProgress(true);
        break;
      case MESSAGE_TYPES.GAME_OVER:
        setInitialized(false);
        setInProgress(false);
        setGameSettings(null);
        setPlayerOrder([]);
        break;
      default:
        break;
    }
  };

  // Public channel
  const broadcastChannel = useChannel(broadcastChannelName, (msg) =>
    broadcastChannelHandler(msg as TypedMessage),
  );

  const directMessageHandler = (msg: TypedMessage) => {
    if (msg.clientId === user?.uid) {
      return;
    }
    switch (msg.name) {
      case MESSAGE_TYPES.REFRESH:
        setLoaded(true);
        if (msg.data.gameState) {
          setInitialized(true);
          setGameSettings(msg.data.gameState.settings);
          setPlayerOrder(msg.data.gameState.playerOrder);
        }
        break;

      default:
        console.warn("Unhandled message type", msg.name);
        break;
    }
  };

  // Private channel
  const directMessageChannel = useChannel(directMessageChannelName, (msg) =>
    directMessageHandler(msg as TypedMessage),
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
    playerOrder,
    inProgress: inProgress,
    initialized: initialized,
    settings: gameSettings,
  };

  return loaded ? (
    <TableState.Provider value={value}>
      <div className="TablePage">
        <PaperButton
          className="TablePage-ExitButton"
          onClick={handleLeaveTable}
          startIcon={<LogoutIcon style={{ transform: "rotate(180deg)" }} />}
        >
          Exit
        </PaperButton>
        <div className="TablePage-Main">
          {initialized && inProgress ? (
            <div>
              <Button
                id="end-game"
                variant="contained"
                onClick={() => {
                  sendCommand({
                    name: COMMAND_TYPES.END_GAME,
                    data: undefined,
                  });
                }}
              >
                End Game
              </Button>
            </div>
          ) : (
            <GameMenu />
          )}
        </div>
        <div className="TablePage-SideBar">
          <LinkButton tableId={tableId} />
          <Chat />
        </div>
      </div>
    </TableState.Provider>
  ) : (
    <LoadingPage />
  );
}
