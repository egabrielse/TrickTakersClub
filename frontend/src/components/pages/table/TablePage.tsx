import LogoutIcon from "@mui/icons-material/Logout";
import { Message } from "ably";
import { useChannel, usePresence } from "ably/react";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { MESSAGE_TYPES } from "../../../constants/message";
import { PATHS } from "../../../constants/url";
import { GameSettings } from "../../../types/game";
import PaperButton from "../../common/PaperButton";
import { DialogContext } from "../../dialog/DialogProvider";
import LoadingPage from "../loading/LoadingPage";
import Chat from "./Chat/Chat";
import GameSettingsDisplay from "./GameSettings/GameSettingsDisplay";
import LinkButton from "./LinkButton";
import { TableContext } from "./TableLoader";
import "./TablePage.scss";

export const TableState = createContext<{
  sendChatMessage: (message: string) => void;
  sendCommand: (name: string, data: object | string) => void;
  gameSettings: GameSettings | null;
  chatMessages: Message[];
}>({
  sendChatMessage: () => {},
  sendCommand: () => {},
  gameSettings: null,
  chatMessages: [],
});

export default function TablePage() {
  // ### Contexts ###
  const { tableId, publicChannelName, privateChannelName } =
    useContext(TableContext);
  const { openDialog } = useContext(DialogContext);
  const navigate = useNavigate();
  // ### State ###
  const [initialized, setInitialized] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Enter the public channel presence
  usePresence(publicChannelName);

  // Public channel
  const publicChannel = useChannel(publicChannelName, (msg) => {
    switch (msg.name) {
      case MESSAGE_TYPES.UPDATE_SETTINGS:
        if (msg?.data?.gameSettings) {
          setGameSettings(msg.data.gameSettings);
        }
        break;
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

      default:
        break;
    }
  });

  // Private channel
  const privateChannel = useChannel(privateChannelName, (msg) => {
    switch (msg.name) {
      case MESSAGE_TYPES.STATE:
        setInitialized(true);
        msg.data;
        if (msg?.data?.gameSettings) {
          setGameSettings(msg.data.gameSettings);
        }
        break;
      default:
        break;
    }
  });

  /**
   * Sends a chat message to other players
   * @param data
   */
  const sendChatMessage = (message: string) => {
    publicChannel.publish(MESSAGE_TYPES.CHAT, message);
  };

  /**
   * Send a command to the service over the private channel
   * @param name
   * @param data
   */
  const sendCommand = (name: string, data: object | string) => {
    privateChannel.publish(name, data);
  };

  /**
   * Leave the table and navigate back to the home page
   */
  const handleLeaveTable = () => navigate(PATHS.HOME);

  return initialized ? (
    <TableState.Provider
      value={{ sendChatMessage, sendCommand, gameSettings, chatMessages }}
    >
      <div className="TablePage">
        <PaperButton
          className="TablePage-ExitButton"
          onClick={handleLeaveTable}
          startIcon={<LogoutIcon style={{ transform: "rotate(180deg)" }} />}
        >
          Exit
        </PaperButton>
        <div className="TablePage-Main">
          {gameSettings && <GameSettingsDisplay />}
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
