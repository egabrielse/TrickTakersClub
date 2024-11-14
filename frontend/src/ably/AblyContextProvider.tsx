import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import React, { useRef } from "react";

// TODO: Should use token authentication in production
const ABLY_API_KEY = import.meta.env.VITE_ABLY_API_KEY;

type AblyContextProviderProps = {
  children: React.ReactNode;
  clientId: string;
};

export default function AblyContextProvider({
  children,
  clientId,
}: AblyContextProviderProps) {
  const clientRef = useRef(new Ably.Realtime({ key: ABLY_API_KEY, clientId }));
  return <AblyProvider client={clientRef.current}>{children}</AblyProvider>;
}
