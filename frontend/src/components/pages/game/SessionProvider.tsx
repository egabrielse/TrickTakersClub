import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import auth from "../../../firebase/auth";
import authSlice from "../../../store/slices/auth.slice";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const wsRef = useRef<WebSocket | null>(null);
  const token = useSelector(authSlice.selectors.token);

  useEffect(() => {
    if (!sessionId) return;
    if (auth.currentUser === null) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://${host}${port}/api/play/v1/connect/${sessionId}?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
    };

    return () => {
      ws.close();
    };
  }, [sessionId]);

  return children;
}
