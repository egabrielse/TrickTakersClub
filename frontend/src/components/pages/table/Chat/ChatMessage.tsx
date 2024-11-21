import { Skeleton } from "@mui/material";
import { Message } from "ably";
import { FunctionComponent, useContext } from "react";
import UserAvatar from "../../../common/UserAvatar";
import { UserStoreContext } from "../../../contexts/UserStoreProvider";
import "./ChatMessage.scss";

type MessageProps = {
  message: Message;
};

const ChatMessage: FunctionComponent<MessageProps> = ({ message }) => {
  const { useCachedUser } = useContext(UserStoreContext);
  const { data, clientId, timestamp } = message;
  const time = new Date(timestamp!).toLocaleTimeString();
  const { user, status } = useCachedUser(clientId!);

  return (
    <div className="ChatMessage">
      <div className="ChatMessage-IconContainer">
        <UserAvatar
          loading={status !== "loaded"}
          name={user?.displayName || undefined}
          size="small"
        />
      </div>
      <div className="ChatMessage-MessageContainer">
        <div className="ChatMessage-MessageContainer-ByLine">
          <span className="ChatMessage-MessageContainer-ByLine-Sender">
            {status === "loaded" ? (
              user!.displayName!
            ) : (
              <Skeleton variant="text" />
            )}
          </span>
          <span className="ChatMessage-MessageContainer-ByLine-TimeStamp">
            {time}
          </span>
        </div>
        <span className="ChatMessage-MessageContainer-Content">{data}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
