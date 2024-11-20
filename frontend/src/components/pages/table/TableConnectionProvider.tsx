import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useContext, useRef, useState } from "react";
import { fetchAblyToken } from "../../../api/ably.api";
import { AuthContext } from "../auth/AuthProvider";
import LoadingPage from "../loading/LoadingPage";
import { TableStateContext } from "./TableStateProvider";

type TablePageWrapperProps = {
  children: React.ReactNode;
};

export default function TableConnectionProvider({
  children,
}: TablePageWrapperProps) {
  const { table } = useContext(TableStateContext);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useContext(AuthContext);

  const clientRef = useRef(
    new Ably.Realtime({
      authCallback: async (_, callback) => {
        try {
          const result = await fetchAblyToken();
          callback(null, result.tokenRequest);
          setLoading(false);
        } catch (error) {
          callback(error as string, null);
          return;
        }
      },
      clientId: user!.uid,
    }),
  );

  return loading ? (
    <LoadingPage />
  ) : (
    <AblyProvider client={clientRef.current}>
      <ChannelProvider channelName={table.id}>{children}</ChannelProvider>
    </AblyProvider>
  );
}
