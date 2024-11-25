import { useChannel, usePresence, usePresenceListener } from "ably/react";
import { useContext } from "react";
import { DIALOG_TYPES } from "../../../constants/dialog";
import { DialogContext } from "../../dialog/DialogProvider";
import { AuthContext } from "../auth/AuthContextProvider";
import Chat from "./Chat/Chat";
import GameSettings from "./GameSettings/GameSettings";
import { TableStateContext } from "./TableContextProvider";
import "./TablePage.scss";

export default function TablePage() {
  const { user } = useContext(AuthContext);
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
      <div className="TablePage-Main">
        {user?.uid === table.hostId && <GameSettings />}
      </div>
      <div className="TablePage-SideBar">
        <span>{table.id}</span>
        <Chat />
      </div>
    </div>
  );
}
