import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useAppSelector } from "../../../../../store/hooks";
import sessionSlice from "../../../../../store/slices/session.slice";
import { ChatMessage } from "../../../../../types/message/misc";
import SessionContext from "../../SessionContext";
import "./index.scss";
import MessageGroup from "./MessageGroup";

const MAX_MESSAGE_LENGTH = 60;

// TODO: disable auto scrolling when the user intentionally scroll up the chat
export default function Chat() {
  const chat = useAppSelector(sessionSlice.selectors.chat);
  const { sendChatMsg } = useContext(SessionContext);

  const [value, setValue] = useState("");
  const chatLength = chat.length;

  const scrollToBottom = () => {
    const messages = document.getElementById("chat-messages");
    const bottom = document.getElementById("chat-bottom");
    if (messages && bottom) {
      messages.scrollTop = bottom.offsetTop;
    }
  };

  useEffect(() => {
    scrollToBottom();
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
              const timeDiff =
                Date.parse(msg.timestamp!) - Date.parse(lastMsg.timestamp!);
              if (msg.senderId === lastMsg.senderId && timeDiff < 60000) {
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
        margin="dense"
        onChange={(e) => setValue(e.target.value)}
        onSubmit={onSubmit}
        onPaste={(e) => {
          // Trim the pasted text to 90 characters
          const pastedText = e.clipboardData.getData("text/plain");
          if (pastedText.length > MAX_MESSAGE_LENGTH) {
            e.preventDefault();
            const newValue = pastedText.substring(0, MAX_MESSAGE_LENGTH);
            setValue(newValue);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (value.trim().length > 0) {
              e.preventDefault();
              onSubmit();
            }
          } else if (value.length >= MAX_MESSAGE_LENGTH) {
            if (
              e.key !== "Backspace" &&
              e.key !== "Delete" &&
              e.key !== "ArrowLeft" &&
              e.key !== "ArrowRight"
            ) {
              e.preventDefault();
            }
          }
        }}
        helperText={`${value.length}/${MAX_MESSAGE_LENGTH}`}
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
          formHelperText: {
            style: {
              padding: 0,
              margin: 0,
              textAlign: "end",
              color: value.length >= MAX_MESSAGE_LENGTH ? "red" : "inherit",
            },
          },
        }}
      />
    </div>
  );
}
