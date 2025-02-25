import { Skeleton } from "@mui/material";
import { FunctionComponent } from "react";
import { useCachedUser } from "../../../../../store/hooks";
import { ChatMessage } from "../../../../../types/message/broadcast";
import UserAvatar from "../../../../common/UserAvatar";
import "./ChatMessageBubble.scss";

type MessageProps = {
  message: ChatMessage;
};

const ChatMessageBubble: FunctionComponent<MessageProps> = ({ message }) => {
  const { data, clientId, timestamp } = message;
  const time = new Date(timestamp!).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const { user, status } = useCachedUser(clientId!);

  return (
    <div className="ChatMessageBubble">
      <div className="ChatMessageBubble-IconContainer">
        <UserAvatar
          loading={status !== "loaded"}
          name={user?.displayName || undefined}
          size="small"
        />
      </div>
      <div className="ChatMessageBubble-MessageContainer">
        <div className="ChatMessageBubble-MessageContainer-ByLine">
          <span className="ChatMessageBubble-MessageContainer-ByLine-Sender">
            {status === "loaded" ? (
              user!.displayName!
            ) : (
              <Skeleton variant="text" />
            )}
          </span>
          <span className="ChatMessageBubble-MessageContainer-ByLine-TimeStamp">
            {time}
          </span>
        </div>
        <span className="ChatMessageBubble-MessageContainer-Content">
          {data.message}
        </span>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
