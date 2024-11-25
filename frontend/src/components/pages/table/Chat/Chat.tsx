import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputAdornment, Paper, TextField } from "@mui/material";
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
    <Paper className="Chat">
      <div className="Chat-Messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>
      <TextField
        id="chat-input"
        name="chat-input"
        placeholder="Type a message..."
        value={value}
        multiline
        onChange={(e) => setValue(e.target.value)}
        onSubmit={sendChatMessage}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendChatMessage();
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={sendChatMessage}
                  disabled={value.trim().length === 0}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Paper>
  );
}
