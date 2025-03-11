import Skeleton from "@mui/material/Skeleton";
import { useContext } from "react";
import { FETCH_STATUS } from "../../../constants/api";
import ProfileContext from "./ProfileContext";

export default function DisplayName() {
  const { user, status } = useContext(ProfileContext);

  return status === FETCH_STATUS.LOADED ? (
    <span className="DisplayName">{user.displayName || user.email}</span>
  ) : (
    <Skeleton className="DisplayName" variant="text" width={100} />
  );
}
