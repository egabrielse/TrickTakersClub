import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { TableState } from "../TablePage";
import "./Chat.scss";
import ChatMessage from "./ChatMessage";

export default function Chat() {
  const { chatMessages, sendChatMessage } = useContext(TableState);
  const [value, setValue] = useState("");

  const onSubmit = () => {
    sendChatMessage(value);
    setValue("");
  };

  return (
    <Paper className="Chat">
      <div className="Chat-Messages">
        {chatMessages.map((msg, i) => (
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
