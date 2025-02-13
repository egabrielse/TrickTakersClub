import { useEffect } from "react";
import { CachedUser } from "../types/user";
import userSlice from "./slices/user.slice";
import { FETCH_STATUS } from "../constants/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from ".";


export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export const useAppSelector = useSelector.withTypes<RootState>()

export const useCachedUser = (uid: string): CachedUser => {
    const dispatch = useAppDispatch();
    const users = useAppSelector(userSlice.selectors.users);
    const user = users[uid];

    useEffect(() => {
        if (!user) {
            dispatch(userSlice.actions.asyncFetchUser(uid));
        }
    }, [dispatch, uid, user]);

    if (!user) {
        return { user: undefined, status: FETCH_STATUS.LOADING, error: undefined };
    } else {
        return user;
    }
}

