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
  src?: string;
  name?: string;
  size?: Size;
};

export default function UserAvatar(props: UserAvatarProps) {
  // defaults to medium if not provided
  const initials = getInitials(props.name || "");
  const pixelSize = getAvatarPixelSize(props.size || "medium");
  const fontSize = getAvatarFontSize(
    props.size || "medium",
    initials.length as 1 | 2 | 3,
  );

  if (props.loading) {
    return <Skeleton variant="circular" width={pixelSize} height={pixelSize} />;
  } else if (props.src) {
    return (
      <Avatar
        alt={props.name}
        src={props.src}
        sizes="large"
        sx={{
          border: "1px solid #FFFFFF",
          bgcolor: props.bgColor || "#FFFFFF",
          width: pixelSize,
          height: pixelSize,
          fontSize,
          color: "#FFFFFF",
        }}
      />
    );
  } else if (props.name) {
    return (
      <Avatar
        alt={props.name}
        sx={{
          border: "1px solid #FFFFFF",
          bgcolor: props.bgColor || usernameToColor(props.name),
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
