import { Skeleton, Typography } from "@mui/material";
import { useContext } from "react";
import { Size } from "../../types/size";
import { getDisplayNameFontSize } from "../../utils/user";
import { UserStoreContext } from "../providers/UserStoreProvider";
import "./ProfileSnapshot.scss";
import UserAvatar from "./UserAvatar";

type UserProps = {
  uid: string;
  variant: "avatar" | "name-row" | "name-column";
  size?: Size;
};

export default function ProfileSnapshot({ uid, variant, size }: UserProps) {
  const { useCachedUser } = useContext(UserStoreContext);
  const { user, status } = useCachedUser(uid);
  const displayNameFontSize = getDisplayNameFontSize(size || "medium");
  const includeName = variant === "name-row" || variant === "name-column";
  const flexDirection = variant === "name-row" ? "row" : "column";

  return (
    <div className="ProfileSnapshot" style={{ flexDirection }}>
      {status === "loaded" ? (
        <UserAvatar name={user.displayName || user.email!} size={size} />
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
