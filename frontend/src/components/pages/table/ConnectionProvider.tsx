import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
  usePresence,
} from "ably/react";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchAblyToken } from "../../../api/ably.api";
import { fetchTable } from "../../../api/table.api";
import { BROADCAST_TYPES, DIRECT_TYPES } from "../../../constants/message";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import gameSlice from "../../../store/slices/game.slice";
import handSlice from "../../../store/slices/hand.slice";
import tableSlice from "../../../store/slices/table.slice";
import {
  BroadcastMessage,
  ChatMessage,
} from "../../../types/message/broadcast";
import { CommandMessage } from "../../../types/message/command";
import { DirectMessage } from "../../../types/message/direct";
import ErrorPage from "../error/ErrorPage";
import LoadingOverlay from "../loading/LoadingOverlay";
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
  const [connectionState, setConnectionState] =
    useState<Ably.ConnectionState | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Alert other users to the presence of this user
  usePresence(broadcastName);

  // Listen for incoming broadcast messages from the server worker
  const broadcast = useChannel(broadcastName, (message) => {
    const msg: BroadcastMessage = message as BroadcastMessage;
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
      case BROADCAST_TYPES.NEW_TRICK:
        dispatch(handSlice.actions.startNewTrick(msg.data));
        break;
      case BROADCAST_TYPES.UP_NEXT:
        dispatch(handSlice.actions.upNext(msg.data));
        break;
      case BROADCAST_TYPES.CALLED_CARD:
        dispatch(handSlice.actions.calledCard(msg.data));
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      case BROADCAST_TYPES.GONE_ALONE:
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      case BROADCAST_TYPES.PARTNER_REVEALED:
        dispatch(handSlice.actions.partnerRevealed(msg.data));
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      case BROADCAST_TYPES.TRICK_DONE: {
        dispatch(handSlice.actions.trickDone(msg.data.trickSummary));
        if (msg.data.handSummary) {
          dispatch(gameSlice.actions.handDone(msg.data.handSummary));
        }
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      }
      case BROADCAST_TYPES.BLIND_PICKED:
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      case BROADCAST_TYPES.CARD_PLAYED: {
        dispatch(handSlice.actions.cardPlayed(msg.data));
        dispatch(handSlice.actions.displayMessage({ ...msg }));
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
      case DIRECT_TYPES.INITIALIZE: {
        setRefreshed(true);
        dispatch(tableSlice.actions.initialize(msg.data));
        dispatch(gameSlice.actions.initialize(msg.data));
        dispatch(handSlice.actions.initialize(msg.data));
        break;
      }
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
    // Then send the command to the server
    direct?.publish(command.name, command.data);
  };

  const retryInTimeoutCallback = () => {
    if (timeLeft > 1000) {
      setTimeLeft(timeLeft - 1000);
    } else {
      setTimeLeft(0);
    }
  };

  // Listen for changes in the connection state
  useConnectionStateListener((state) => {
    setConnectionState(state.current);
    switch (state.current) {
      case "disconnected":
        setRefreshed(false);
        if (state.retryIn && state.retryIn > 1000) {
          setTimeLeft(state.retryIn);
          setTimeout(retryInTimeoutCallback, 1000);
        }
        break;
      default:
        break;
    }
  });

  console.log(refreshed);
  return (
    <>
      {connectionState === "connecting" || !refreshed ? (
        <LoadingOverlay text="Connecting to the table" trailingEllipsis />
      ) : connectionState === "disconnected" ? (
        <LoadingOverlay
          text={`Disconnected. Retrying in... ${timeLeft / 1000}`}
        />
      ) : null}
      <ConnectionContext.Provider value={{ sendChatMsg, sendCommand }}>
        {children}
      </ConnectionContext.Provider>
    </>
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
  const [client, setClient] = useState<Ably.Realtime | null>(null);
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
        const newAblyClient = new Ably.Realtime({
          authCallback: async (_, callback) => {
            try {
              const result = await fetchAblyToken();
              callback(null, result.tokenRequest);
            } catch (e) {
              callback(e as string, null);
              return;
            }
          },
          clientId: uid,
        });
        setClient(newAblyClient);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));

    return () => {
      // Reset the state when leaving the page
      dispatch(tableSlice.actions.reset());
      dispatch(gameSlice.actions.reset());
      dispatch(handSlice.actions.reset());
      // Close the Ably connection
      client?.close();
      setClient(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <LoadingOverlay text={`Searching for ${paramTableId}`} />
  ) : client === null ? (
    <LoadingOverlay text={`Connecting to ${paramTableId}`} />
  ) : error ? (
    <ErrorPage error={error} />
  ) : (
    <AblyProvider client={client}>
      <ChannelProvider channelName={broadcastName}>
        <ChannelProvider channelName={directName}>
          <ConnectionApiProvider
            broadcastName={broadcastName}
            directName={directName}
          >
            {children}
          </ConnectionApiProvider>
        </ChannelProvider>
      </ChannelProvider>
    </AblyProvider>
  );
}
