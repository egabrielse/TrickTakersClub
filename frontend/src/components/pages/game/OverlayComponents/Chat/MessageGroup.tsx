import { ChatMessage } from "../../../../../types/message/misc";
import DisplayName from "../../../../common/Profile/DisplayName";
import ProfilePic from "../../../../common/Profile/ProfilePic";
import ProfileProvider from "../../../../common/Profile/ProfileProvider";
import "./MessageGroup.scss";

type MessageGroupProps = {
  children: ChatMessage[];
};

export default function MessageGroup({ children }: MessageGroupProps) {
  const { senderId, timestamp } = children[0];
  const time = new Date(timestamp!).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="MessageGroup">
      <div className="MessageGroup-ByLine">
        <ProfileProvider uid={senderId!}>
          <span className="MessageGroup-ByLine-Sender">
            <ProfilePic size="small" />
            <DisplayName />
          </span>
        </ProfileProvider>
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
