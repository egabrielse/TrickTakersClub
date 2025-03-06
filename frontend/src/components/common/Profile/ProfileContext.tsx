import { createContext } from "react";
import { FETCH_STATUS } from "../../../constants/api";
import { CachedUser, LoadingUser } from "../../../types/user";

const DEFAULT_VALUE: LoadingUser = {
  user: undefined,
  status: FETCH_STATUS.LOADING,
  error: undefined,
} as const;

const ProfileContext = createContext<CachedUser>(DEFAULT_VALUE);

export default ProfileContext;
