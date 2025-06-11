import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  BROADCAST_RECEIVER,
  SESSION_WORKER_ID,
} from "../../../constants/message";
import { CLOSE_REASON, CONNECTION_STATUS } from "../../../constants/socket";
import { PATHS } from "../../../constants/url";
import auth from "../../../firebase/auth";
import { useAppDispatch } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import gameSlice from "../../../store/slices/game.slice";
import handSlice from "../../../store/slices/hand.slice";
import sessionSlice from "../../../store/slices/session.slice";
import {
  ConnectionTimeoutError,
  ErrorPageError,
  SessionFullError,
  SessionNotFoundError,
  SessionTimeoutError,
} from "../../../types/error";
import { UnknownMessage } from "../../../types/message/base";
import { CommandMessage } from "../../../types/message/command";
import { EventMessage } from "../../../types/message/event";
import { ChatMessage } from "../../../types/message/misc";
import { ConnectionStatus } from "../../../types/socket";
import { newChatMessage } from "../../../utils/message";
import { getWebSocketUrl } from "../../../utils/socket";
import ErrorPage from "../error/ErrorPage";
import LoadingOverlay from "../loading/LoadingOverlay";
import SessionContext from "./SessionContext";

const REFRESH_ACTION = {
  label: "Refresh Page",
  onClick: () => window.location.reload(),
  icon: <RefreshIcon />,
};

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sessionId } = useParams<{ sessionId: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const token = useSelector(authSlice.selectors.token);
  const uid = useSelector(authSlice.selectors.uid);
  const [messages, setMessages] = useState<
    (EventMessage | ChatMessage | UnknownMessage)[]
  >([]);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(
    CONNECTION_STATUS.DISCONNECTED,
  );

  /**
   * Send an action message to the session worker.
   * @param action
   */
  const sendCommand = (message: CommandMessage) => {
    message.senderId = uid;
    message.receiverId = SESSION_WORKER_ID;
    wsRef.current?.send(JSON.stringify(message));
  };

  /**
   * Send a chat message to the session worker.
   * @param message
   */
  const sendChatMsg = (message: string) => {
    const chatMessage = newChatMessage({ message });
    chatMessage.senderId = uid;
    chatMessage.receiverId = BROADCAST_RECEIVER;
    wsRef.current?.send(JSON.stringify(chatMessage));
  };

  /**
   * Returns the next message in the queue and removes it from the queue,
   * otherwise returns null if there are no messages.
   */
  const getNextMessage = () => {
    if (messages.length > 0) {
      const message = messages[0];
      setMessages((prevMessages) => prevMessages.slice(1));
      return message;
    }
    return null;
  };

  /**
   * Establish a WebSocket connection to the server
   * @throws Error if user is unauthenticated, or either sessionId or token are not available
   */
  const establishWebsocketConnection = useCallback(() => {
    if (!sessionId) {
      throw new Error("Session ID is required");
    } else if (auth.currentUser === null) {
      throw new Error("User not authenticated");
    } else if (!token) {
      throw new Error("No token available");
    }
    wsRef.current = new WebSocket(getWebSocketUrl(sessionId, token));

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
      setStatus(CONNECTION_STATUS.CONNECTED);
    };

    wsRef.current.onclose = (event) => {
      if (event.code === 1000) {
        console.log("WebSocket closed normally:", event);
        // Normal closure
        switch (event.reason) {
          case CLOSE_REASON.HANDSHAKE:
            break; // Do nothing
          case CLOSE_REASON.CONNECTION_TIMEOUT:
            setError(new ConnectionTimeoutError());
            break;
          case CLOSE_REASON.SESSION_TIMEOUT:
            setError(new SessionTimeoutError());
            break;
          case CLOSE_REASON.SESSION_NOT_FOUND:
            setError(new SessionNotFoundError());
            break;
          case CLOSE_REASON.SESSION_FULL:
            setError(new SessionFullError());
            break;
          default:
            setError(
              new ErrorPageError(
                "Connection Error",
                "Error occurred while connecting to the session.",
              ),
            );
            break;
        }
        setStatus(CONNECTION_STATUS.DISCONNECTED);
      } else {
        console.log("WebSocket closed unexpectedly:", event);
        console.log("Attempting to reconnect in 5 seconds...");
        // Abnormal closure, attempt to reconnect
        setStatus(CONNECTION_STATUS.RECONNECTING);
        setTimeout(() => {
          establishWebsocketConnection();
        }, 5000); // Retry after 5 seconds
      }
    };

    wsRef.current.onerror = (error) => {
      console.error(error);
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };
  }, [sessionId, token]);

  /**
   * Connect to the WebSocket server when the component mounts.
   */
  useEffect(() => {
    setStatus(CONNECTION_STATUS.CONNECTING);
    establishWebsocketConnection();
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000);
        wsRef.current.onclose = null; // Clear the onclose handler
        wsRef.current.onerror = null; // Clear the onerror handler
        wsRef.current.onmessage = null; // Clear the onmessage handler
        wsRef.current = null; // Clear the WebSocket reference
      }
    };
  }, [establishWebsocketConnection]);

  useEffect(() => {
    // Reset the state when the component unmounts
    return () => {
      dispatch(sessionSlice.actions.reset());
      dispatch(gameSlice.actions.reset());
      dispatch(handSlice.actions.reset());
    };
  }, [dispatch]);

  if (error) {
    return (
      <ErrorPage
        error={error}
        actions={[
          {
            label: "Browse Other Sessions",
            onClick: () => navigate(PATHS.BROWSER),
            icon: <ArrowBackIcon />,
          },
        ]}
      />
    );
  } else if (status === CONNECTION_STATUS.DISCONNECTED) {
    return (
      <ErrorPage
        error={new Error("Connection lost, try refreshing the page.")}
        actions={[REFRESH_ACTION]}
      />
    );
  } else if (
    status === CONNECTION_STATUS.CONNECTING ||
    status === CONNECTION_STATUS.RECONNECTING
  ) {
    return <LoadingOverlay text={`Connecting`} trailingEllipsis />;
  } else {
    return (
      <SessionContext.Provider
        value={{
          status,
          sendCommand,
          sendChatMsg,
          getNextMessage,
          messageCount: messages.length,
        }}
      >
        {children}
      </SessionContext.Provider>
    );
  }
}
