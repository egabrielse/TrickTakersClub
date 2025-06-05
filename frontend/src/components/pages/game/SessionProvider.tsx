import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { CONNECTION_STATUS } from "../../../constants/socket";
import auth from "../../../firebase/auth";
import authSlice from "../../../store/slices/auth.slice";
import { ConnectionStatus } from "../../../types/socket";
import SessionContext from "./SessionContext";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const token = useSelector(authSlice.selectors.token);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    CONNECTION_STATUS.DISCONNECTED,
  );

  useEffect(() => {
    if (!sessionId) return;
    if (auth.currentUser === null) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }
    setConnectionStatus(CONNECTION_STATUS.CONNECTING);
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://${host}${port}/api/play/v1/connect/${sessionId}?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus(CONNECTION_STATUS.CONNECTED);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus(CONNECTION_STATUS.ERROR);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
    };

    return () => {
      ws.close();
    };
  }, [sessionId, token]);

  return (
    <SessionContext.Provider value={{ connectionStatus }}>
      {children}
    </SessionContext.Provider>
  );
}
