import RefreshIcon from "@mui/icons-material/Refresh";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { CONNECTION_STATUS } from "../../../constants/socket";
import auth from "../../../firebase/auth";
import authSlice from "../../../store/slices/auth.slice";
import { Message } from "../../../types/message";
import { ConnectionStatus } from "../../../types/socket";
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
  const { sessionId } = useParams<{ sessionId: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const token = useSelector(authSlice.selectors.token);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(
    CONNECTION_STATUS.DISCONNECTED,
  );

  /**
   * Send a message to the server
   * @param action
   */
  const sendMessage = (message: Message) => {
    wsRef.current?.send(JSON.stringify(message));
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
      console.log("WebSocket connected");
      setStatus(CONNECTION_STATUS.CONNECTED);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setStatus(CONNECTION_STATUS.DISCONNECTED);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError(new Error("WebSocket connection error"));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
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
        wsRef.current.close();
      }
    };
  }, [establishWebsocketConnection]);

  if (error) {
    return <ErrorPage error={error} actions={[REFRESH_ACTION]} />;
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
          sendMessage,
          getNextMessage,
          messageCount: messages.length,
        }}
      >
        {children}
      </SessionContext.Provider>
    );
  }
}
