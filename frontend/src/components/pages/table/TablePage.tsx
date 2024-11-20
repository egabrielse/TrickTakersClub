import { useChannel, usePresence, usePresenceListener } from "ably/react";
import { useContext } from "react";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { useAppSelector } from "../../../redux/hooks";
import { selectTableId } from "../../../redux/selectors";
import { DialogContext } from "../providers/DialogContextProvider";
import Chat from "./Chat/Chat";
import "./TablePage.scss";

export default function TablePage() {
  const { openDialog } = useContext(DialogContext);
  const tableId = useAppSelector(selectTableId);
  usePresence(tableId);
  usePresenceListener(tableId, (presence) => {
    console.log(presence);
  });
  useChannel(tableId, "timeout", () => {
    // navigate to the home page if the table times out
    openDialog({
      type: DIALOG_TYPES.ERROR,
      closeable: false,
      props: {
        title: "Timeout Due to Inactivity",
        message: "The table was inactive for too long.",
      },
    });
  });

  return (
    <div className="TablePage">
      <Chat />
      <span>{tableId}</span>
      <div></div>
    </div>
  );
}
