import { useChannel, usePresence, usePresenceListener } from "ably/react";
import { DIALOG_TYPES } from "../../../constants/dialog";
import dialogActions from "../../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectTableId } from "../../../redux/selectors";
import Chat from "./Chat/Chat";
import "./TablePage.scss";

export default function TablePage() {
  const tableId = useAppSelector(selectTableId);
  const dispatch = useAppDispatch();
  usePresence(tableId);
  usePresenceListener(tableId, (presence) => {
    console.log(presence);
  });
  useChannel(tableId, "timeout", () => {
    // navigate to the home page if the table times out
    dispatch(
      dialogActions.openDialog({
        type: DIALOG_TYPES.ERROR,
        closeable: false,
        props: {
          title: "Timeout Due to Inactivity",
          message:
            "The table was inactive for too long. Redirecting to the home page.",
        },
      }),
    );
  });

  return (
    <div className="TablePage">
      <Chat />
      <span>{tableId}</span>
      <div></div>
    </div>
  );
}
