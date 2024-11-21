import { Message } from "ably";
import { useChannel } from "ably/react";
import { useContext, useState } from "react";
import { TableStateContext } from "../TableContextProvider";
import "./Chat.scss";
import ChatMessage from "./ChatMessage";

export default function Chat() {
  const { table } = useContext(TableStateContext);
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { publish } = useChannel(table.id, "chat", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  const sendChatMessage = () => {
    publish("chat", value);
    setValue("");
  };

  return (
    <div className="Chat">
      <div className="Chat-Messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>
      <div className="Chat-Input">
        <input
          placeholder="Type a message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size={24}
          onSubmit={sendChatMessage}
        />
        <button
          type="submit"
          disabled={value.trim().length === 0}
          onClick={sendChatMessage}
        >
          {"Send"}
        </button>
      </div>
    </div>
  );
}
