import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import auth from "../../../firebase/auth";
import { User } from "../../../types/user";

export const AUTH_ACTIONS = {
    LOGIN: "auth/LOGIN",
    SIGNUP: "auth/SIGNUP",
    LOGOUT: "auth/LOGOUT",
    RESET_ERROR: "auth/RESET_ERROR",
    INITIALIZE_USER: "auth/INITIALIZE_USER",
    SEND_PASSWORD_RESET_EMAIL: "auth/SEND_PASSWORD_RESET_EMAIL",
};

type InitializeUserPayload = {
    user: User | null;
};

type LoginPayload = {
    email: string;
    password: string;
};

type LoginPromise = {
    user: User;
};

type SignUpPayload = {
    email: string;
    password: string;
    displayName: string;
};

type SignUpPromise = {
    user: User;
};

const authActions = {
    login: createAsyncThunk<LoginPromise, LoginPayload>(
        AUTH_ACTIONS.LOGIN,
        async ({ email, password }) => {
            const response = await signInWithEmailAndPassword(auth, email, password);
            return {
                user: {
                    uid: response.user.uid,
                    email: String(response.user.email),
                    displayName: String(response.user.displayName),
                },
            };
        },
    ),
    signUp: createAsyncThunk<SignUpPromise, SignUpPayload>(
        AUTH_ACTIONS.SIGNUP,
        async ({ email, password, displayName }) => {
            // Create the new user account
            const res = await createUserWithEmailAndPassword(auth, email, password);
            // Set the display name for the user
            await updateProfile(res.user, { displayName });
            // Reload the user to get the updated display name
            await res.user.reload();
            return {
                user: {
                    uid: res.user.uid,
                    email: String(res.user.email),
                    displayName: String(res.user.displayName),
                },
            };
        },
    ),
    logout: createAsyncThunk(AUTH_ACTIONS.LOGOUT, async () => {
        return signOut(auth);
    }),
    resetError: createAction(AUTH_ACTIONS.RESET_ERROR),
    initializeUser: createAction<InitializeUserPayload>(AUTH_ACTIONS.INITIALIZE_USER),
    sendPasswordResetEmail: createAsyncThunk(AUTH_ACTIONS.SEND_PASSWORD_RESET_EMAIL, async (email: string) => {
        return sendPasswordResetEmail(auth, email);
    }),
};

export default authActions;
