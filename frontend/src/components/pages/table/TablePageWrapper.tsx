import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { fetchAblyToken } from "../../../api/ably.api";
import { DIALOG_TYPES } from "../../../constants/dialog";
import dialogActions from "../../../redux/features/dialog/actions";
import tableActions from "../../../redux/features/table/actions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectTableError, selectTableLoading } from "../../../redux/selectors";
import { AuthContext } from "../auth/AuthContextProvider";
import LoadingPage from "../loading/LoadingPage";

type TablePageWrapperProps = {
  children: React.ReactNode;
};

/**
 * Wrapper for the TablePage component that checks that the table exists and connects to Ably.
 */
export default function TablePageWrapper({ children }: TablePageWrapperProps) {
  const params = useParams();
  const paramTableId = String(params.tableId);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectTableLoading);
  const error = useAppSelector(selectTableError);
  const { user } = useContext(AuthContext);
  const clientRef = useRef(
    new Ably.Realtime({
      authCallback: async (_, callback) => {
        try {
          const result = await fetchAblyToken();
          callback(null, result.tokenRequest);
        } catch (error) {
          callback(error as string, null);
          return;
        }
      },
      clientId: user!.uid,
    }),
  );

  useEffect(() => {
    dispatch(tableActions.fetchTable(paramTableId));
    return () => {
      dispatch(tableActions.resetTable());
    };
  }, [dispatch, paramTableId]);

  useEffect(() => {
    if (error) {
      dispatch(
        dialogActions.openDialog({
          type: DIALOG_TYPES.ERROR,
          props: {
            title: "Table Not Found",
            message: "There was an error finding this table.",
          },
        }),
      );
    }
  }, [dispatch, error]);

  return loading ? (
    <LoadingPage />
  ) : (
    <AblyProvider client={clientRef.current}>
      <ChannelProvider channelName={paramTableId}>{children}</ChannelProvider>
    </AblyProvider>
  );
}
