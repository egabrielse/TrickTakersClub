import { Skeleton } from "@mui/material";
import { FunctionComponent, useContext } from "react";
import { ChatMessage } from "../../../../../types/message/broadcast";
import UserAvatar from "../../../../common/UserAvatar";
import { UserStoreContext } from "../../../../providers/UserStoreProvider";
import "./MessageBubble.scss";

type MessageProps = {
  message: ChatMessage;
};

const MessageBubble: FunctionComponent<MessageProps> = ({ message }) => {
  const { useCachedUser } = useContext(UserStoreContext);
  const { data, clientId, timestamp } = message;
  const time = new Date(timestamp!).toLocaleTimeString();
  const { user, status } = useCachedUser(clientId!);

  return (
    <div className="MessageBubble">
      <div className="MessageBubble-IconContainer">
        <UserAvatar
          loading={status !== "loaded"}
          name={user?.displayName || undefined}
          size="small"
        />
      </div>
      <div className="MessageBubble-MessageContainer">
        <div className="MessageBubble-MessageContainer-ByLine">
          <span className="MessageBubble-MessageContainer-ByLine-Sender">
            {status === "loaded" ? (
              user!.displayName!
            ) : (
              <Skeleton variant="text" />
            )}
          </span>
          <span className="MessageBubble-MessageContainer-ByLine-TimeStamp">
            {time}
          </span>
        </div>
        <span className="MessageBubble-MessageContainer-Content">
          {data.message}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
