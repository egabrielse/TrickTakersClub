import { FETCH_STATUS } from "../constants/api";

export type UserEntity = {
    uid: string;
    displayName: string;
    email: string;
};

export interface LoadedUser {
    user: UserEntity;
    status: typeof FETCH_STATUS.LOADED;
    error: undefined;
}

export interface LoadingUser {
    user: UserEntity | undefined;
    status: typeof FETCH_STATUS.LOADING;
    error: undefined;
}

export interface ErrorUser {
    user: undefined;
    status: typeof FETCH_STATUS.ERROR;
    error: string;
}

export type CachedUser = (
    LoadedUser |
    LoadingUser |
    ErrorUser
);

export type UserSettingsEntity = {
    soundOn: boolean;
};