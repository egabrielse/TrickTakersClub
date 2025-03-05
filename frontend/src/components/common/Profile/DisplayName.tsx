import { Typography, TypographyProps } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useContext } from "react";
import { FETCH_STATUS } from "../../../constants/api";
import ProfileContext from "./ProfileContext";

export default function DisplayName(props: TypographyProps) {
  const { user, status } = useContext(ProfileContext);

  return status === FETCH_STATUS.LOADED ? (
    <Typography lineHeight={1} {...props}>
      {user.displayName || user.email}
    </Typography>
  ) : (
    <Skeleton variant="text" width={100} />
  );
}
