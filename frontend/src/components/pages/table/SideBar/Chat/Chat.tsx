import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { TableState } from "../../TableStateProvider";
import "./Chat.scss";
import ChatMessage from "./ChatMessage";

// TODO: consolidate chat messages if they are from the same user and within a certain time frame
export default function Chat() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chat, sendChatMsg } = useContext(TableState);
  const [value, setValue] = useState("");
  const chatLength = chat.length;

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatLength]);

  const onSubmit = () => {
    sendChatMsg(value);
    setValue("");
  };

  return (
    <Paper className="Chat">
      <div className="Chat-Messages">
        {chat.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
      <TextField
        id="chat-input"
        name="chat-input"
        placeholder="Type a message..."
        value={value}
        multiline
        onChange={(e) => setValue(e.target.value)}
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (value.trim().length > 0) {
              e.preventDefault();
              onSubmit();
            }
          }
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={onSubmit}
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
