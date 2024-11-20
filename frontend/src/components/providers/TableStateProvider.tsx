import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router";
import { fetchTable } from "../../api/table.api";
import { DIALOG_TYPES } from "../../constants/dialog";
import { Table } from "../../types/table";
import LoadingPage from "../pages/loading/LoadingPage";
import { DialogContext } from "./DialogProvider";

type TableStateProviderProps = {
  children: ReactNode;
};

export const TableStateContext = createContext<{
  table: Table;
}>({
  table: {
    id: "",
    hostId: "",
  },
});

export default function TableStateProvider({
  children,
}: TableStateProviderProps) {
  const params = useParams();
  const paramTableId = String(params.tableId);
  const { openDialog } = useContext(DialogContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [table, setTable] = useState<Table>({
    id: "",
    hostId: "",
  });

  useEffect(() => {
    setLoading(true);
    fetchTable(paramTableId)
      .then((table) => {
        setTable(table);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
        openDialog({
          type: DIALOG_TYPES.ERROR,
          props: {
            title: "Table Not Found",
            message: "There was an error finding this table.",
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading || error ? (
    <LoadingPage />
  ) : (
    <TableStateContext.Provider value={{ table }}>
      {children}
    </TableStateContext.Provider>
  );
}
