import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import { useContext } from "react";
import { FETCH_STATUS } from "../../../constants/api";
import { Size } from "../../../types/size";
import {
  getAvatarFontSize,
  getAvatarPixelSize,
  getInitials,
  usernameToColor,
} from "../../../utils/user";
import ProfileContext from "./ProfileContext";

type ProfilePicProps = {
  size?: Size;
};

export default function ProfilePic({ size = "medium" }: ProfilePicProps) {
  const { user, status } = useContext(ProfileContext);
  const pixelSize = getAvatarPixelSize(size);

  if (status === FETCH_STATUS.LOADED) {
    const initials = getInitials(user.displayName);
    return (
      <Avatar
        alt={user.displayName}
        sx={{
          border: "1px solid #FFFFFF",
          bgcolor: usernameToColor(user.displayName),
          width: pixelSize,
          height: pixelSize,
          fontSize: getAvatarFontSize(size, initials.length as 1 | 2 | 3),
          color: "#FFFFFF",
        }}
        children={initials}
      />
    );
  } else {
    return <Skeleton variant="circular" width={pixelSize} height={pixelSize} />;
  }
}
