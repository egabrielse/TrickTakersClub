import "./UserSnapshot.scss";
import UserAvatar from "./UserAvatar";
import { User } from "firebase/auth";
import { getDisplayNameFontSize } from "../../utils/user";
import { Size } from "../../types/size";

type UserProps = {
  user: User;
  variant: "avatar" | "name-row" | "name-column";
  size?: Size;
};

export default function UserSnapshot({ user, variant, size }: UserProps) {
  const displayNameFontSize = getDisplayNameFontSize(size || "medium");
  const includeName = variant === "name-row" || variant === "name-column";
  const flexDirection = variant === "name-row" ? "row" : "column";
  const name = user.displayName || user.email!;

  return (
    <div className="UserSnapshot" style={{ flexDirection }}>
      <UserAvatar name={name} size={size} />
      {includeName && (
        <span style={{ fontSize: displayNameFontSize }}>{name}</span>
      )}
    </div>
  );
}
