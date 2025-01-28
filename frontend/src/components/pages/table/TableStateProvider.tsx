import { Message } from "ably";
import { useChannel, usePresence } from "ably/react";
import { ReactNode, createContext, useContext, useState } from "react";
import { GAME_SETTINGS_DEFAULTS } from "../../../constants/game";
import {
  BROADCAST_TYPES,
  COMMAND_TYPES,
  DIRECT_TYPES,
} from "../../../constants/message";
import { GameSettings, Scoreboard } from "../../../types/game";
import {
  BroadcastMessage,
  ChatMessage,
} from "../../../types/message/broadcast";
import { CommandMessage } from "../../../types/message/command";
import { DirectMessage } from "../../../types/message/direct";
import { ChannelContext } from "./ChannelContextProvider";

const DefaultGameSettings: GameSettings = {
  autoDeal: GAME_SETTINGS_DEFAULTS.AUTO_DEAL,
  playerCount: GAME_SETTINGS_DEFAULTS.PLAYER_COUNT,
  callingMethod: GAME_SETTINGS_DEFAULTS.CALLING_METHODS,
  noPickResolution: GAME_SETTINGS_DEFAULTS.NO_PICK_RESOLUTIONS,
  doubleOnTheBump: GAME_SETTINGS_DEFAULTS.DOUBLE_ON_THE_BUMP,
};

export const TableState = createContext<{
  loaded: boolean;
  chat: ChatMessage[];
  sendChatMsg: (message: string) => void;
  sendCommand: (command: CommandMessage) => void;
  settings: GameSettings;
  settingsPending: boolean;
  scoreboard: Scoreboard;
  handsPlayed: number;
  inProgress: boolean;
  seating: string[];
  upNextId: string;
}>({
  loaded: false,
  chat: [],
  sendChatMsg: () => {},
  sendCommand: () => {},
  settings: DefaultGameSettings,
  settingsPending: false,
  scoreboard: {},
  handsPlayed: 0,
  inProgress: false,
  seating: [],
  upNextId: "",
});

type TableStateProviderProps = {
  children: ReactNode;
};

export default function TableStateProvider({
  children,
}: TableStateProviderProps) {
  const { broadcastChannelName, directMessageChannelName } =
    useContext(ChannelContext);

  // ~~~ Table Variables ~~~
  // True if the state of the table/game is fetched from the server, otherwise false
  const [loaded, setLoaded] = useState<boolean>(false);
  // Chat messages between players
  const [chat, setChat] = useState<ChatMessage[]>([]);

  // ~~~ Game Variables ~~~
  // True if a game is in progress, otherwise false
  const [inProgress, setInProgress] = useState<boolean>(false);
  // Settings for configuring a game
  const [settings, setSettings] = useState<GameSettings>(DefaultGameSettings);
  // True if a change is waiting to be confirmed, otherwise false
  const [settingsPending, setSettingsPending] = useState<boolean>(false);
  // Scoreboard for the current game
  const [scoreboard, setScoreboard] = useState<Scoreboard>({});
  // Number of hands played this game
  const [handsPlayed, setHandsPlayed] = useState<number>(0);
  // Players seated at the table
  const [seating, setSeating] = useState<string[]>([]);

  // ~~~ Hand Variables ~~~
  const [upNextId, setUpNextId] = useState<string>("");

  /**
   * Enter the public channel presence
   */
  usePresence(broadcastChannelName);

  /**
   * TODO
   */
  const broadcast = useChannel(broadcastChannelName, (message: Message) => {
    console.debug("Broadcast Message Received", message);
    const msg = message as BroadcastMessage;
    switch (msg.name) {
      case BROADCAST_TYPES.CHAT:
        setChat((prev) => [...prev, msg]);
        break;
      case BROADCAST_TYPES.SETTINGS_UPDATED:
        setSettingsPending(false);
        setSettings(msg.data.settings);
        setSeating(msg.data.seating);
        break;
      case BROADCAST_TYPES.GAME_STARTED:
        setInProgress(true);
        break;
      case BROADCAST_TYPES.SAT_DOWN:
        setSeating((prev) => [...prev, msg.data.playerId]);
        break;
      case BROADCAST_TYPES.STOOD_UP:
        setSeating((prev) =>
          prev.filter((playerId) => playerId !== msg.data.playerId),
        );
        break;
      default:
        console.warn("Unhandled message type", msg.name);
        break;
    }
  });

  /**
   * TODO
   * @param message
   */
  const sendChatMsg = (message: string) => {
    broadcast.publish(BROADCAST_TYPES.CHAT, message);
  };

  /**
   * TODO
   */
  const direct = useChannel(directMessageChannelName, (message: Message) => {
    console.debug("Direct Message Received", message);
    const msg = message as DirectMessage;
    switch (msg.name) {
      case DIRECT_TYPES.REFRESH:
        setLoaded(true);
        setSeating(msg.data.seating);
        setSettings(msg.data.settings);
        setInProgress(msg.data.gameInProgress);
        setScoreboard(msg.data.scoreboard);
        setHandsPlayed(msg.data.handsPlayed);
        setUpNextId(msg.data.upNextId);
        break;
      default:
        console.warn("Unhandled message type", msg.name);
        break;
    }
  });

  /**
   * TODO
   * @param command
   */
  const sendCommand = (command: CommandMessage) => {
    console.debug("Command Sent", command);
    // Make any local changes to the state
    switch (command.name) {
      case COMMAND_TYPES.UPDATE_AUTO_DEAL:
      case COMMAND_TYPES.UPDATE_CALLING_METHOD:
      case COMMAND_TYPES.UPDATE_DOUBLE_ON_THE_BUMP:
      case COMMAND_TYPES.UPDATE_NO_PICK_RESOLUTION:
      case COMMAND_TYPES.UPDATE_PLAYER_COUNT:
        setSettingsPending(true);
        // Reset the settings pending state after 5 seconds
        setTimeout(() => setSettingsPending(false), 5000);
        break;
      default:
        break;
    }
    // Then send the command to the server
    direct.publish(command.name, command.data);
  };

  const value = {
    loaded,
    chat,
    sendChatMsg,
    sendCommand,
    settings,
    settingsPending,
    scoreboard,
    handsPlayed,
    inProgress,
    seating,
    upNextId,
  };

  return <TableState.Provider value={value}>{children}</TableState.Provider>;
}
