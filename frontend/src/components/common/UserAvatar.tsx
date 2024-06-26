import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import {
  getAvatarFontSize,
  getAvatarPixelSize,
  getInitials,
  usernameToColor,
} from "../../utils/user";
import { Size } from "../../types/size";

type UserAvatarProps = {
  bgColor?: string;
  loading?: boolean;
  src?: string;
  name?: string;
  size?: Size;
};

export default function UserAvatar(props: UserAvatarProps) {
  // defaults to medium if not provided
  const initials = getInitials(props.name || "");
  const pixelSize = getAvatarPixelSize(props.size || "medium");
  const fontSize = getAvatarFontSize(props.size || "medium", initials.length as 1 | 2 | 3);

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
        children={initials}
      />
    );
  } else {
    return <Avatar sx={{ width: pixelSize, height: pixelSize }} />;
  }
}
