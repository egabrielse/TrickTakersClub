import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
  usePresence,
} from "ably/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { fetchAblyToken } from "../../../api/ably.api";
import { fetchTable } from "../../../api/table.api";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { BROADCAST_TYPES, DIRECT_TYPES } from "../../../constants/message";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import dialogSlice from "../../../store/slices/dialog.slice";
import gameSlice from "../../../store/slices/game.slice";
import handSlice from "../../../store/slices/hand.slice";
import settingsSlice from "../../../store/slices/settings.slice";
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
import dealSound from "/audio/deal-cards.mp3";
import cardSound from "/audio/play-card.mp3";

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
  const [initialized, setInitialized] = useState(false);
  const dispatch = useAppDispatch();
  const uid = useAppSelector(authSlice.selectors.uid);
  const [connectionState, setConnectionState] =
    useState<Ably.ConnectionState | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const soundOn = useAppSelector(settingsSlice.selectors.soundOn);

  // Alert other users to the presence of this user
  usePresence(broadcastName);

  const cardSoundRef = useRef(new Audio(cardSound));
  const dealSoundRef = useRef(new Audio(dealSound));

  const playCardSound = () => {
    if (!soundOn) return;
    cardSoundRef.current.play();
  };

  const dealCardSound = () => {
    if (!soundOn) return;
    dealSoundRef.current.play();
  };

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
      case BROADCAST_TYPES.LAST_HAND_STATUS: {
        dispatch(handSlice.actions.updateLastHandStatus(msg.data));
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
        if (!msg.data.forced) {
          // Only display the message if the player chose to go alone
          // Otherwise the picker probably wants this to remain a secret
          dispatch(handSlice.actions.displayMessage({ ...msg }));
        }
        break;
      case BROADCAST_TYPES.PARTNER_REVEALED:
        dispatch(handSlice.actions.partnerRevealed(msg.data));
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      case BROADCAST_TYPES.TRICK_WON:
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      case BROADCAST_TYPES.HAND_DONE: {
        const { scoreboard, summary } = msg.data;
        dispatch(
          dialogSlice.actions.openDialog({
            type: DIALOG_TYPES.HAND_SUMMARY,
            props: { scoreboard, summary },
          }),
        );
        dispatch(gameSlice.actions.handDone(msg.data));
        break;
      }
      case BROADCAST_TYPES.BLIND_PICKED:
        playCardSound();
        dispatch(handSlice.actions.blindPicked(msg.data));
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      case BROADCAST_TYPES.CARD_PLAYED: {
        playCardSound();
        dispatch(handSlice.actions.cardPlayed(msg.data));
        dispatch(handSlice.actions.displayMessage({ ...msg }));
        break;
      }
      case BROADCAST_TYPES.GAME_OVER: {
        const { scoreboard } = msg.data;
        if (scoreboard.handsPlayed > 0) {
          // If at least one hand has been played, show the final scoreboard
          dispatch(
            dialogSlice.actions.openDialog({
              type: DIALOG_TYPES.GAME_SUMMARY,
              props: { scoreboard: msg.data.scoreboard },
            }),
          );
        }
        dispatch(handSlice.actions.reset());
        dispatch(gameSlice.actions.reset());
        dispatch(tableSlice.actions.resetSeating());
        break;
      }
      case BROADCAST_TYPES.SAT_DOWN:
        dispatch(tableSlice.actions.satDown(msg.data));
        break;
      case BROADCAST_TYPES.STOOD_UP:
        dispatch(tableSlice.actions.stoodUp(msg.data));
        break;
      case BROADCAST_TYPES.TIMEOUT:
        dispatch(
          dialogSlice.actions.openDialog({
            type: DIALOG_TYPES.ERROR,
            props: {
              title: "Timed Out",
              message: "The table was inactive for too long.",
            },
            closeable: false,
          }),
        );
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
        setInitialized(true);
        dispatch(tableSlice.actions.initialize(msg.data));
        dispatch(gameSlice.actions.initialize(msg.data));
        dispatch(handSlice.actions.initialize(msg.data));
        break;
      }
      case DIRECT_TYPES.DEAL_HAND:
        dealCardSound();
        dispatch(handSlice.actions.dealHand(msg.data));
        break;
      case DIRECT_TYPES.PICKED_CARDS:
        dispatch(handSlice.actions.pickedCards(msg.data));
        break;
      case DIRECT_TYPES.BURIED_CARDS:
        playCardSound();
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
    console.log(direct);
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
        if (state.retryIn && state.retryIn > 1000) {
          setTimeLeft(state.retryIn);
          setTimeout(retryInTimeoutCallback, 1000);
        }
        break;
      default:
        break;
    }
  });

  if (connectionState === "connecting" || !initialized) {
    return <LoadingOverlay text="Connecting to table" />;
  } else {
    return (
      <>
        {connectionState === "disconnected" && (
          <LoadingOverlay
            text={`Disconnected. Retrying in... ${timeLeft / 1000}`}
          />
        )}
        <ConnectionContext.Provider value={{ sendChatMsg, sendCommand }}>
          {children}
        </ConnectionContext.Provider>
      </>
    );
  }
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

  return error ? (
    <ErrorPage error={error} />
  ) : loading ? (
    <LoadingOverlay text={`Searching for ${paramTableId}`} />
  ) : client === null ? (
    <LoadingOverlay text={`Connecting to ${paramTableId}`} />
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
