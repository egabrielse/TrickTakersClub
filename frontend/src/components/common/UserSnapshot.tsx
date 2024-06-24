import UserAvatar from "./UserAvatar";
import { ReactNode } from "react";
import { User } from "firebase/auth";
import { displayNameSizeToFontSize } from "../../utils/user";

export type AvatarBadgeProps = {
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  content: ReactNode;
};

type UserProps = {
  user: User;
  variant: "avatar" | "name-row" | "name-column";
  size?: "small" | "medium" | "large" | "xlarge";
};

export default function UserSnapshot({ user, variant, size }: UserProps) {
  const displayNameFontSize = displayNameSizeToFontSize(size || "medium");
  const includeName = variant === "name-row" || variant === "name-column";
  const flexDirection = variant === "name-row" ? "row" : "column";
  const name = user.displayName || user.email!;

  return (
    <div
      style={{
        display: "flex",
        flexDirection,
        alignItems: "center",
        width: "fit-content",
      }}
    >
      <UserAvatar name={name} size={size} />
      {(includeName) && (
        <span style={{ fontSize: displayNameFontSize}}>
          {name}
        </span>
      )}
    </div>
  );
}
