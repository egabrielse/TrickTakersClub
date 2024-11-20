import { useChannel } from "ably/react";
import { useContext, useState } from "react";
import { TableStateContext } from "../TableStateProvider";
import "./Chat.scss";

export default function Chat() {
  const { table } = useContext(TableStateContext);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const { publish } = useChannel(table.id, "chat", (msg) => {
    setMessages((prev) => [...prev, msg.data]);
  });

  const sendChatMessage = () => {
    publish("chat", value);
    setValue("");
  };

  return (
    <div className="Chat">
      <div className="Chat-Messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <div className="Chat-Input">
        <input
          placeholder="Type a message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size={24}
        />
        <button disabled={value.trim().length === 0} onClick={sendChatMessage}>
          {"Send"}
        </button>
      </div>
    </div>
  );
}
