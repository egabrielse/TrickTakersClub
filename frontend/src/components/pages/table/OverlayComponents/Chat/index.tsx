import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useAppSelector } from "../../../../../store/hooks";
import tableSlice from "../../../../../store/slices/table.slice";
import { ChatMessage } from "../../../../../types/message/broadcast";
import ConnectionContext from "../../ConnectionContext";
import "./index.scss";
import MessageGroup from "./MessageGroup";

// TODO: consolidate chat messages if they are from the same user and within a certain time frame
export default function Chat() {
  const chat = useAppSelector(tableSlice.selectors.chat);
  const { sendChatMsg } = useContext(ConnectionContext);

  const [value, setValue] = useState("");
  const chatLength = chat.length;

  useEffect(() => {
    const messages = document.getElementById("chat-messages");
    const bottom = document.getElementById("chat-bottom");
    if (messages && bottom) {
      messages.scrollTop = bottom.offsetTop;
    }
  }, [chatLength]);

  const onSubmit = () => {
    sendChatMsg(value);
    setValue("");
  };

  return (
    <div className="Chat">
      <div id="chat-messages" className="Chat-Messages">
        {chat.length > 0 &&
          chat
            .reduce((acc, msg, i) => {
              if (i === 0) {
                return [[msg]];
              }
              const lastGroup = acc[acc.length - 1];
              const lastMsg = lastGroup[lastGroup.length - 1];
              const timeDiff = msg.timestamp! - lastMsg.timestamp!;
              if (msg.clientId === lastMsg.clientId && timeDiff < 60000) {
                lastGroup.push(msg);
              } else {
                acc.push([msg]);
              }
              return acc;
            }, [] as ChatMessage[][])
            .map((group, i) => <MessageGroup key={i}>{group}</MessageGroup>)}
        {chat.length === 0 && <i className="EmptyMessage">No messages</i>}
        <div id="chat-bottom" />
      </div>
      <TextField
        id="chat-input"
        name="chat-input"
        className="Chat-Input"
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
    </div>
  );
}
