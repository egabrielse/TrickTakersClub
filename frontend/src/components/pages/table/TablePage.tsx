import { useChannel, usePresence, usePresenceListener } from "ably/react";
import { useState } from "react";
import { DIALOG_TYPES } from "../../../constants/dialog";
import dialogActions from "../../../redux/features/dialog/actions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectTableId } from "../../../redux/selectors";
import "./TablePage.scss";

export default function TablePage() {
  const [value, setValue] = useState("");
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

  const { publish } = useChannel(tableId, "chat", (msg) => {
    console.log(msg.data);
  });

  const sendChatMessage = () => {
    publish("chat", value);
    setValue("");
  };

  return (
    <div className="TablePage">
      <span>{tableId}</span>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={sendChatMessage}>Send</button>
    </div>
  );
}
