import { ReactNode, useEffect } from "react";

import { FETCH_STATUS } from "../../../constants/api";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import userSlice from "../../../store/slices/user.slice";
import ProfileContext from "./ProfileContext";

type ProfileProviderProps = {
  uid: string;
  children: ReactNode;
};

export default function ProfileProvider({
  uid,
  children,
}: ProfileProviderProps) {
  const dispatch = useAppDispatch();
  const userCache = useAppSelector(userSlice.selectors.users);
  const record = userCache[uid] || {
    user: undefined,
    status: FETCH_STATUS.LOADING,
    error: undefined,
  };

  useEffect(() => {
    if (!(uid in userCache)) {
      dispatch(userSlice.actions.asyncFetchUser(uid));
    }
  }, [dispatch, uid, userCache]);

  return (
    <ProfileContext.Provider value={record}>{children}</ProfileContext.Provider>
  );
}
