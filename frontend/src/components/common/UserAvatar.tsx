import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import {
  avatarSizeToFontSize,
  avatarSizeToPixels,
  initials,
  usernameToColor,
} from "../../utils/user";

type UserAvatarProps = {
  bgColor?: string;
  loading?: boolean;
  src?: string;
  name?: string;
  size?: "small" | "medium" | "large" | "xlarge";
};

export default function UserAvatar(props: UserAvatarProps) {
  // defaults to medium if not provided
  const pixelSize = avatarSizeToPixels(props.size || "medium");
  const fontSize = avatarSizeToFontSize(props.size || "medium");

  if (props.loading) {
    return <Skeleton variant="circular" width={pixelSize} height={pixelSize} />;
  } else if (props.src) {
    return (
      <Avatar
        alt={props.name}
        src={props.src}
        sizes="large"
        sx={{
          bgcolor: props.bgColor || "#FFFFFF",
          width: pixelSize,
          height: pixelSize,
          fontSize,
        }}
      />
    );
  } else if (props.name) {
    return (
      <Avatar
        alt={props.name}
        sx={{
          bgcolor: props.bgColor || usernameToColor(props.name),
          width: pixelSize,
          height: pixelSize,
          fontSize,
        }}
        children={initials(props.name)}
      />
    );
  } else {
    return <Avatar sx={{ width: pixelSize, height: pixelSize }} />;
  }
}
