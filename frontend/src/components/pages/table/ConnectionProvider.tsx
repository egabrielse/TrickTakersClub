import { ChannelProvider, useChannel, usePresence } from "ably/react";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchTable } from "../../../api/table.api";
import { BROADCAST_TYPES, DIRECT_TYPES } from "../../../constants/message";
import authSlice from "../../../store/slices/auth.slice";
import gameSlice from "../../../store/slices/game.slice";
import handSlice from "../../../store/slices/hand.slice";
import tableSlice from "../../../store/slices/table.slice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  BroadcastMessage,
  ChatMessage,
} from "../../../types/message/broadcast";
import { CommandMessage } from "../../../types/message/command";
import { DirectMessage } from "../../../types/message/direct";
import ErrorPage from "../error/ErrorPage";
import LoadingPage from "../loading/LoadingPage";
import ConnectionContext from "./ConnectionContext";

type ConnectionApiProviderProps = {
  children: ReactNode;
  broadcastName: string;
  directName: string;
};

function ConnectionApiProvider({
  children,
  broadcastName,
  directName,
}: ConnectionApiProviderProps) {
  const [refreshed, setRefreshed] = useState(false);
  const dispatch = useAppDispatch();
  const uid = useAppSelector(authSlice.selectors.uid);

  // Alert other users to the presence of this user
  usePresence(broadcastName);

  // Listen for incoming broadcast messages from the server worker
  const broadcast = useChannel(broadcastName, (message) => {
    const msg: BroadcastMessage = message as BroadcastMessage;
    console.log("Received broadcast message", msg);
    switch (msg.name) {
      case BROADCAST_TYPES.CHAT: {
        const chatMsg: ChatMessage = { ...msg, clientId: msg.clientId };
        dispatch(tableSlice.actions.chatMessageReceived(chatMsg));
        break;
      }
      case BROADCAST_TYPES.SETTINGS_UPDATED:
        dispatch(tableSlice.actions.settingsUpdated(msg.data));
        break;
      case BROADCAST_TYPES.GAME_STARTED: {
        dispatch(gameSlice.actions.gameStarted(msg.data));
        break;
      }
      case BROADCAST_TYPES.UP_NEXT:
        dispatch(handSlice.actions.upNext(msg.data));
        break;
      case BROADCAST_TYPES.CALLED_CARD:
        // TODO: display event notification
        dispatch(handSlice.actions.calledCard(msg.data));
        break;
      case BROADCAST_TYPES.GONE_ALONE:
        // TODO: display event notification
        break;
      case BROADCAST_TYPES.PARTNER_REVEALED:
        // TODO: display event notification
        dispatch(handSlice.actions.partnerRevealed(msg.data));
        break;
      case BROADCAST_TYPES.TRICK_DONE: {
        // TODO: display event notification
        dispatch(handSlice.actions.trickDone(msg.data));
        dispatch(gameSlice.actions.trickDone(msg.data));
        break;
      }
      case BROADCAST_TYPES.BLIND_PICKED:
        // TODO: display event notification
        break;
      case BROADCAST_TYPES.CARD_PLAYED: {
        dispatch(handSlice.actions.cardPlayed(msg.data));
        break;
      }
      case BROADCAST_TYPES.GAME_OVER:
        // Reset the state EXCEPT for the hands played and scoreboard
        dispatch(handSlice.actions.reset());
        dispatch(gameSlice.actions.reset());
        break;
      case BROADCAST_TYPES.SAT_DOWN:
        dispatch(tableSlice.actions.satDown(msg.data));
        break;
      case BROADCAST_TYPES.STOOD_UP:
        dispatch(tableSlice.actions.stoodUp(msg.data));
        break;
      default:
        if (msg.clientId !== uid) {
          console.warn("Unhandled broadcast message type", msg.name);
        }
        break;
    }
  });

  // Listen for incoming direct messages from the server worker or other players
  const direct = useChannel(directName, (message) => {
    const msg: DirectMessage = message as DirectMessage;
    switch (msg.name) {
      case DIRECT_TYPES.REFRESH:
        setRefreshed(true);
        dispatch(tableSlice.actions.refreshed(msg.data));
        dispatch(gameSlice.actions.refreshed(msg.data));
        dispatch(handSlice.actions.refreshed(msg.data));
        break;
      case DIRECT_TYPES.DEAL_HAND:
        dispatch(handSlice.actions.dealHand(msg.data));
        break;
      case DIRECT_TYPES.PICKED_CARDS:
        dispatch(handSlice.actions.pickedCards(msg.data));
        break;
      case DIRECT_TYPES.BURIED_CARDS:
        dispatch(handSlice.actions.buriedCards(msg.data));
        break;
      default:
        if (msg.clientId !== uid) {
          console.warn("Unhandled direct message type", msg.name);
        }
        break;
    }
  });

  /**
   * Send a chat message to the table
   * @param message
   */
  const sendChatMsg = (message: string) => {
    broadcast?.publish(BROADCAST_TYPES.CHAT, { message });
  };

  /**
   * Send a command to the table
   * @param command
   */
  const sendCommand = (command: CommandMessage) => {
    console.log("Sending command", command);
    // Then send the command to the server
    direct?.publish(command.name, command.data);
  };

  return refreshed ? (
    <ConnectionContext.Provider value={{ sendChatMsg, sendCommand }}>
      {children}
    </ConnectionContext.Provider>
  ) : (
    <LoadingPage />
  );
}

type ConnectionProviderProps = {
  children: ReactNode;
};

export default function ConnectionProvider({
  children,
}: ConnectionProviderProps) {
  const dispatch = useAppDispatch();
  const params = useParams();
  const paramTableId = String(params.tableId);
  const uid = useAppSelector(authSlice.selectors.uid);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [broadcastName, setBroadcastName] = useState("");
  const [directName, setDirectName] = useState("");

  useEffect(() => {
    // Set the document title to the table id, so it's easy to find in the browser tabs
    document.title = paramTableId;
    setLoading(true);
    fetchTable(paramTableId)
      .then((table) => {
        setBroadcastName(table.id);
        setDirectName(`${table.id}:${uid}`);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

    return () => {
      // Reset the state when leaving the page
      dispatch(tableSlice.actions.reset());
      dispatch(gameSlice.actions.reset());
      dispatch(handSlice.actions.reset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <LoadingPage />
  ) : error ? (
    <ErrorPage error={error} />
  ) : (
    <ChannelProvider channelName={paramTableId}>
      <ChannelProvider channelName={`${paramTableId}:${uid}`}>
        <ConnectionApiProvider
          broadcastName={broadcastName}
          directName={directName}
        >
          {children}
        </ConnectionApiProvider>
      </ChannelProvider>
    </ChannelProvider>
  );
}
