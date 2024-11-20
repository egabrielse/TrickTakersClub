import { useChannel, usePresence, usePresenceListener } from "ably/react";
import { useContext } from "react";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { DialogContext } from "../../providers/DialogProvider";
import { TableStateContext } from "../../providers/TableStateProvider";
import Chat from "./Chat/Chat";
import "./TablePage.scss";

export default function TablePage() {
  const { table } = useContext(TableStateContext);
  const { openDialog } = useContext(DialogContext);
  usePresence(table.id);
  usePresenceListener(table.id, (presence) => {
    console.log(presence);
  });
  useChannel(table.id, "timeout", () => {
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
      <span>{table.id}</span>
      <div></div>
    </div>
  );
}
