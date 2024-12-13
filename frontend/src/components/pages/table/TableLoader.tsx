import { ChannelProvider } from "ably/react";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router";
import { fetchTable } from "../../../api/table.api";
import { AuthContext } from "../auth/AuthContextProvider";
import ErrorPage from "../error/ErrorPage";
import LoadingPage from "../loading/LoadingPage";

export const TableContext = createContext<{
  tableId: string;
  hostId: string;
  broadcastChannelName: string;
  directMessageChannelName: string;
}>({
  tableId: "",
  hostId: "",
  broadcastChannelName: "",
  directMessageChannelName: "",
});

type TableLoaderProps = {
  children: ReactNode;
};

/**
 * Fetches the table data and provides the tableId and hostId to the children
 */
export default function TableLoader({ children }: TableLoaderProps) {
  const params = useParams();
  const paramTableId = String(params.tableId);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [tableId, setTableId] = useState<string>("");
  const [hostId, setHostId] = useState<string>("");
  const [broadcastChannelName, setPublicChannelName] = useState<string>("");
  const [directMessageChannelName, setPrivateChannelName] =
    useState<string>("");

  useEffect(() => {
    setLoading(true);
    fetchTable(paramTableId)
      .then((table) => {
        setTableId(table.id);
        setHostId(table.hostId);
        setPublicChannelName(table.id);
        setPrivateChannelName(`${table.id}:${user?.uid}`);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [paramTableId, tableId, user]);

  return loading ? (
    <LoadingPage />
  ) : error ? (
    <ErrorPage error={error} />
  ) : (
    <TableContext.Provider
      value={{
        tableId,
        hostId,
        broadcastChannelName,
        directMessageChannelName,
      }}
    >
      <ChannelProvider channelName={broadcastChannelName}>
        <ChannelProvider channelName={directMessageChannelName}>
          {children}
        </ChannelProvider>
      </ChannelProvider>
    </TableContext.Provider>
  );
}
