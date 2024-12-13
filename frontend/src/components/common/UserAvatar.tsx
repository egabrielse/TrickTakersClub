import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import { Size } from "../../types/size";
import {
  getAvatarFontSize,
  getAvatarPixelSize,
  getInitials,
  usernameToColor,
} from "../../utils/user";

type UserAvatarProps = {
  bgColor?: string;
  loading?: boolean;
  avatar?: string;
  name?: string;
  size?: Size;
};

export default function UserAvatar({
  bgColor,
  loading,
  avatar,
  name,
  size,
}: UserAvatarProps) {
  // defaults to medium if not provided
  const initials = getInitials(name || "");
  const pixelSize = getAvatarPixelSize(size || "medium");
  const fontSize = getAvatarFontSize(
    size || "medium",
    initials.length as 1 | 2 | 3,
  );

  if (loading) {
    return <Skeleton variant="circular" width={pixelSize} height={pixelSize} />;
  } else if (avatar) {
    return (
      <Avatar
        alt={name}
        sizes="large"
        sx={{
          border: "1px solid #FFFFFF",
          bgcolor: bgColor || "#FFFFFF",
          width: pixelSize,
          height: pixelSize,
          fontSize,
          color: "#FFFFFF",
        }}
        children={avatar}
      />
    );
  } else if (name) {
    return (
      <Avatar
        alt={name}
        sx={{
          border: "1px solid #FFFFFF",
          bgcolor: bgColor || usernameToColor(name),
          width: pixelSize,
          height: pixelSize,
          fontSize,
          color: "#FFFFFF",
        }}
        children={initials}
      />
    );
  } else {
    return (
      <Avatar
        sx={{
          border: "1px solid #FFFFFF",
          width: pixelSize,
          height: pixelSize,
        }}
      />
    );
  }
}
