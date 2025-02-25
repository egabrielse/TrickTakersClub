import { Badge, Skeleton, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useCachedUser } from "../../store/hooks";
import { Size } from "../../types/size";
import { getDisplayNameFontSize } from "../../utils/user";
import "./ProfileSnapshot.scss";
import UserAvatar from "./UserAvatar";

type ProfileSnapshotProps = {
  id?: string;
  uid: string;
  variant: "avatar" | "name-row" | "name-column";
  size?: Size;
  leftBadgeContent?: ReactNode;
  leftBadgeColor?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  rightBadgeContent?: ReactNode;
  rightBadgeColor?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
};

export default function ProfileSnapshot({
  id,
  uid,
  variant,
  size = "medium",
  leftBadgeContent,
  leftBadgeColor,
  rightBadgeContent,
  rightBadgeColor,
}: ProfileSnapshotProps) {
  const { user, status } = useCachedUser(uid);
  const displayNameFontSize = getDisplayNameFontSize(size);
  const includeName = variant === "name-row" || variant === "name-column";
  const flexDirection = variant === "name-row" ? "row" : "column";

  return (
    <div id={id} className="ProfileSnapshot" style={{ flexDirection }}>
      {status === "loaded" ? (
        <Badge
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          color={leftBadgeColor}
          badgeContent={leftBadgeContent}
          overlap="circular"
          showZero
        >
          <Badge
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            color={rightBadgeColor}
            badgeContent={rightBadgeContent}
            overlap="circular"
            showZero
          >
            <UserAvatar name={user.displayName || user.email!} size={size} />
          </Badge>
        </Badge>
      ) : (
        <UserAvatar loading size={size} />
      )}
      {includeName &&
        (status === "loaded" ? (
          <Typography fontSize={displayNameFontSize}>
            {user.displayName || user.email!}
          </Typography>
        ) : (
          <Skeleton variant="text" height={displayNameFontSize} width={100} />
        ))}
    </div>
  );
}
