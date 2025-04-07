import RefreshIcon from "@mui/icons-material/Refresh";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchAblyToken } from "../../../api/ably.api";
import { fetchTable } from "../../../api/table.api";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import gameSlice from "../../../store/slices/game.slice";
import handSlice from "../../../store/slices/hand.slice";
import tableSlice from "../../../store/slices/table.slice";
import ErrorPage from "../error/ErrorPage";
import LoadingOverlay from "../loading/LoadingOverlay";
import AblyMessageHandler from "./AblyMessageHandler";

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

  const refreshPage = () => {
    window.location.reload();
  };

  return error ? (
    <ErrorPage
      error={error}
      actions={[
        { label: "Refresh Page", onClick: refreshPage, icon: <RefreshIcon /> },
      ]}
    />
  ) : loading ? (
    <LoadingOverlay text={`Searching for ${paramTableId}`} />
  ) : client === null ? (
    <LoadingOverlay text={`Connecting to ${paramTableId}`} />
  ) : (
    <AblyProvider client={client}>
      <ChannelProvider channelName={broadcastName}>
        <ChannelProvider channelName={directName}>
          <AblyMessageHandler
            broadcastName={broadcastName}
            directName={directName}
          >
            {children}
          </AblyMessageHandler>
        </ChannelProvider>
      </ChannelProvider>
    </AblyProvider>
  );
}
