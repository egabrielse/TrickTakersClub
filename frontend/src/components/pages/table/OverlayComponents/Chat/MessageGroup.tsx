import { Skeleton } from "@mui/material";
import { useCachedUser } from "../../../../../store/hooks";
import { ChatMessage } from "../../../../../types/message/broadcast";
import UserAvatar from "../../../../common/UserAvatar";
import "./MessageGroup.scss";

type MessageGroupProps = {
  children: ChatMessage[];
};

export default function MessageGroup({ children }: MessageGroupProps) {
  const { clientId, timestamp } = children[0];
  const time = new Date(timestamp!).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const { user, status } = useCachedUser(clientId!);

  return (
    <div className="MessageGroup">
      <div className="MessageGroup-ByLine">
        <UserAvatar
          loading={status !== "loaded"}
          name={user?.displayName || undefined}
          size="small"
        />
        <span className="MessageGroup-ByLine-Sender">
          {status === "loaded" ? (
            user!.displayName!
          ) : (
            <Skeleton variant="text" />
          )}
        </span>
        <span className="MessageGroup-ByLine-TimeStamp">{time}</span>
      </div>
      <div className="MessageGroup-Messages">
        {children.map((child) => (
          <span key={`msg-${child.id}`}>{child.data.message}</span>
        ))}
      </div>
    </div>
  );
}
