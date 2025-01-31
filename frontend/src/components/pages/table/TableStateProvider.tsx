import { Message } from "ably";
import { useChannel, usePresence } from "ably/react";
import { ReactNode, createContext, useContext, useState } from "react";
import { GAME_SETTINGS_DEFAULTS, HAND_PHASE } from "../../../constants/game";
import {
  BROADCAST_TYPES,
  COMMAND_TYPES,
  DIRECT_TYPES,
} from "../../../constants/message";
import {
  GameSettings,
  HandPhase,
  HandSummary,
  PlayingCard,
  Scoreboard,
  Trick,
  newTrick,
} from "../../../types/game";
import {
  BroadcastMessage,
  ChatMessage,
} from "../../../types/message/broadcast";
import { CommandMessage } from "../../../types/message/command";
import { DirectMessage } from "../../../types/message/direct";
import { createNewScoreboard, tallyTricks } from "../../../utils/game";
import { AuthContext } from "../auth/AuthContextProvider";
import { ConnectionContext } from "./ConnectionProvider";

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
  dealerId: string;
  upNextId: string;
  playerOrder: string[];
  phase: HandPhase;
  hand: PlayingCard[];
  blindSize: number;
  bury: PlayingCard[];
  calledCard: PlayingCard | null;
  pickerId: string;
  partnerId: string;
  tricks: Trick[];
  tricksWon: Record<string, number>;
  handSummary: HandSummary | null;
  getCurrentTrick: () => Trick | null;
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
  dealerId: "",
  upNextId: "",
  playerOrder: [],
  phase: HAND_PHASE.SETUP,
  hand: [],
  blindSize: 0,
  bury: [],
  calledCard: null,
  pickerId: "",
  partnerId: "",
  tricks: [],
  tricksWon: {},
  handSummary: null,
  getCurrentTrick: () => null,
});

type TableStateProviderProps = {
  children: ReactNode;
};

export default function TableStateProvider({
  children,
}: TableStateProviderProps) {
  const { broadcastChannelName, directMessageChannelName } =
    useContext(ConnectionContext);
  const { user } = useContext(AuthContext);

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
  // Summary of the current hand (populated after the hand is complete)
  const [handSummary, setHandSummary] = useState<HandSummary | null>(null);

  // ~~~ Hand Variables ~~~
  // Id of the dealer for the current hand
  const [dealerId, setDealerId] = useState<string>("");
  // Id of the player who is up next
  const [upNextId, setUpNextId] = useState<string>("");
  // Order of players in the current hand
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  // Phase of the current hand
  const [phase, setPhase] = useState<HandPhase>(HAND_PHASE.SETUP);
  // Cards in the player's hand
  const [hand, setHand] = useState<PlayingCard[]>([]);
  // Count of cards in the blind
  const [blindSize, setBlindSize] = useState<number>(0);
  // Cards buried by the player (if they are the picker)
  const [bury, setBury] = useState<PlayingCard[]>([]);
  // The card that was called by the picker
  const [calledCard, setCalledCard] = useState<PlayingCard | null>(null);
  // Id of the player who is the picker
  const [pickerId, setPickerId] = useState<string>("");
  // Id of the partner of the picker (once partner is revealed)
  const [partnerId, setPartnerId] = useState<string>("");
  // Tricks played in the current hand
  const [tricks, setTricks] = useState<Trick[]>([]);
  // Count of tricks won by each player in the current hand
  const [tricksWon, setTricksWon] = useState<Record<string, number>>({});

  /**
   * Enter the public channel presence
   */
  usePresence(broadcastChannelName);

  /**
   * Message handler for broadcast messages
   */
  const broadcast = useChannel(broadcastChannelName, (message: Message) => {
    console.log("Broadcast Message Received", message);
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
      case BROADCAST_TYPES.GAME_STARTED: {
        setInProgress(true);
        setScoreboard(createNewScoreboard(msg.data.playerOrder));
        break;
      }
      case BROADCAST_TYPES.UP_NEXT:
        setUpNextId(msg.data.playerId);
        setPhase(msg.data.phase);
        break;
      case BROADCAST_TYPES.CALLED_CARD:
        setCalledCard(msg.data.card);
        break;
      case BROADCAST_TYPES.GONE_ALONE:
        // TODO: popup message saying picker went alone
        break;
      case BROADCAST_TYPES.PARTNER_REVEALED:
        // TODO: popup message saying pointing out the partner
        setPartnerId(msg.data.playerId);
        break;
      case BROADCAST_TYPES.TRICK_DONE: {
        if (msg.data.trickSummary) {
          setTricksWon((prev) => ({
            ...prev,
            [msg.data.trickSummary.takerId]:
              prev[msg.data.trickSummary.takerId] + 1,
          }));
        }
        if (msg.data.handSummary) {
          // Hand is over, update the hand summary
          setHandSummary(msg.data.handSummary);
          // TODO: popup message with hand summary
        } else {
          // Otherwise move onto the next trick
          setTricks((prev) => [...prev, newTrick()]);
        }
        break;
      }
      case BROADCAST_TYPES.BLIND_PICKED:
        // TODO: popup message
        setPickerId(msg.data.playerId);
        break;
      case BROADCAST_TYPES.CARD_PLAYED: {
        setTricks((prev) => {
          const trick = prev[prev.length - 1];
          trick.cards[msg.data.playerId] = msg.data.card;
          return prev;
        });
        break;
      }
      case BROADCAST_TYPES.GAME_OVER:
        // Reset the state EXCEPT for the hands played and scoreboard
        setInProgress(false);
        setDealerId("");
        setSeating([]);
        setHand([]);
        setBury([]);
        setCalledCard(null);
        setPickerId("");
        setPartnerId("");
        setPhase(HAND_PHASE.SETUP);
        setUpNextId("");
        setPlayerOrder([]);
        setTricks([]);
        setTricksWon({});
        setBlindSize(0);
        // TODO: display scoreboard as popup
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
        if (msg.clientId !== user?.uid) {
          console.warn("Unhandled broadcast message type", msg.name);
        }
        break;
    }
  });

  /**
   * Send a chat message to the table
   * @param message
   */
  const sendChatMsg = (message: string) => {
    broadcast.publish(BROADCAST_TYPES.CHAT, message);
  };

  /**
   * Message handler for direct messages
   */
  const direct = useChannel(directMessageChannelName, (message: Message) => {
    console.log("Direct Message Received", message);
    const msg = message as DirectMessage;
    switch (msg.name) {
      case DIRECT_TYPES.REFRESH:
        setLoaded(true);
        setSeating(msg.data.seating || []);
        setSettings(msg.data.settings || DefaultGameSettings);
        setInProgress(msg.data.inProgress || false);
        setScoreboard(msg.data.scoreboard || {});
        setHandsPlayed(msg.data.handsPlayed || 0);
        setUpNextId(msg.data.upNextId || "");
        setPlayerOrder(msg.data.playerOrder || []);
        setDealerId(msg.data.dealerId || "");
        setTricks(msg.data.tricks || []);
        setTricksWon(tallyTricks(msg.data.tricks || []));
        setPhase(msg.data.phase || HAND_PHASE.SETUP);
        setHand(msg.data.hand || []);
        setBlindSize(msg.data.blindSize || 0);
        setBury(msg.data.bury || []);
        setCalledCard(msg.data.calledCard || null);
        setPickerId(msg.data.pickerId || "");
        setPartnerId(msg.data.partnerId || "");
        break;
      case DIRECT_TYPES.DEAL_HAND:
        setHand(msg.data.cards);
        setDealerId(msg.data.dealerId);
        break;
      case DIRECT_TYPES.PICKED_CARDS:
        // TODO: implement
        break;
      case DIRECT_TYPES.BURIED_CARDS:
        // TODO: implement
        break;
      default:
        if (msg.clientId !== user?.uid) {
          console.warn("Unhandled direct message type", msg.name);
        }
        break;
    }
  });

  /**
   * Send a command to the table
   * @param command
   */
  const sendCommand = (command: CommandMessage) => {
    console.log("Command Sent", command);
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

  const getCurrentTrick = () => {
    if (tricks.length === 0) {
      return null;
    }
    return tricks[tricks.length - 1];
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
    dealerId,
    upNextId,
    playerOrder,
    phase,
    hand,
    blindSize,
    bury,
    calledCard,
    pickerId,
    partnerId,
    tricks,
    tricksWon,
    handSummary,
    getCurrentTrick,
  };

  return <TableState.Provider value={value}>{children}</TableState.Provider>;
}
