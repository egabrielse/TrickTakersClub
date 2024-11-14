import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { DIALOG_TYPES } from "../../../constants/dialog";
import dialogActions from "../../../redux/features/dialog/actions";
import tableActions from "../../../redux/features/table/actions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  selectAuthUser,
  selectTableError,
  selectTableLoading,
} from "../../../redux/selectors";
import LoadingPage from "../loading/LoadingPage";

// TODO: Should use token authentication in production
const ABLY_API_KEY = import.meta.env.VITE_ABLY_API_KEY;

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
  const user = useAppSelector(selectAuthUser);
  const clientRef = useRef(
    new Ably.Realtime({
      key: ABLY_API_KEY,
      clientId: user!.uid,
    }),
  );

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

  useEffect(() => {
    dispatch(tableActions.fetchTable(paramTableId));
  }, [dispatch, paramTableId]);

  return loading ? (
    <LoadingPage />
  ) : (
    <AblyProvider client={clientRef.current}>
      <ChannelProvider channelName={paramTableId}>{children}</ChannelProvider>
    </AblyProvider>
  );
}
