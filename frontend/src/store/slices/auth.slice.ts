import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserEntity } from "../../types/user";


interface AuthState {
    uid: string;
    displayName: string;
    email: string;
    token: string | null;
}

const initialState: AuthState = {
    uid: "",
    displayName: "",
    email: "",
    token: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: () => initialState,
        setUser: (state, action: PayloadAction<UserEntity>) => {
            state.uid = action.payload.uid;
            state.displayName = action.payload.displayName;
            state.email = action.payload.email;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        }
    },
    selectors: {
        isAuthenticated: (state: AuthState) => state.token !== null,
        email: (state: AuthState) => state.email,
        displayName: (state: AuthState) => state.displayName,
        uid: (state: AuthState) => state.uid,
        token: (state: AuthState) => state.token,
    }
});

export default authSlice;
