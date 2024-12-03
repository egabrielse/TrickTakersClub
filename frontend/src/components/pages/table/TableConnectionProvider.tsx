import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useContext, useRef, useState } from "react";
import { fetchAblyToken } from "../../../api/ably.api";
import { userChannel } from "../../../utils/ably";
import { AuthContext } from "../auth/AuthContextProvider";
import LoadingPage from "../loading/LoadingPage";
import { TableStateContext } from "./TableContextProvider";

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
      <ChannelProvider channelName={table.id}>
        <ChannelProvider channelName={userChannel(table.id, user!.uid)}>
          {children}
        </ChannelProvider>
      </ChannelProvider>
    </AblyProvider>
  );
}
