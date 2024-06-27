import {
  PayloadAction,
  SerializedError,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import auth from "../../firebase/auth";

export interface AuthState {
  error: SerializedError | null;
  loading: boolean;
  user: User | null;
}

const initialState: AuthState = {
  error: null,
  loading: false,
  user: null,
};

export type AuthActionPayload = {
  email: string;
  password: string;
};

const register = createAsyncThunk(
  "auth/register",
  async (msg: AuthActionPayload): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, msg.email, msg.password);
  },
);

const login = createAsyncThunk(
  "auth/login",
  async (msg: AuthActionPayload): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, msg.email, msg.password);
  },
);

const logout = createAsyncThunk("auth/logout", async (): Promise<void> => {
  return signOut(auth);
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export default {
  reducer: slice.reducer,
  actions: {
    ...slice.actions,
    register,
    login,
    logout,
  },
};
