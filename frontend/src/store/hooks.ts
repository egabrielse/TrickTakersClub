import { useEffect } from "react";
import { CachedUser } from "../types/user";
import userSlice from "./slices/user.slice";
import { FETCH_STATUS } from "../constants/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from ".";


export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export const useAppSelector = useSelector.withTypes<RootState>()
