import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "../types/user";
import { getErrorForDisplay } from "../utils/error";
import auth from "./auth";

type AuthContextState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (
    email: string,
    password: string,
    displayName: string,
    onSuccess: () => void,
    onFailure: () => void,
  ) => void;
  login: (
    email: string,
    password: string,
    onSuccess: () => void,
    onFailure: () => void,
  ) => void;
  logout: () => void;
  clearError: () => void;
  resetPassword: (
    email: string,
    onSuccess: () => void,
    onFailure: () => void,
  ) => void;
};

const defaultValue: AuthContextState = {
  user: null,
  loading: false,
  error: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  clearError: () => {},
  resetPassword: () => {},
};

export const AuthContext = createContext(defaultValue);

type AuthProviderProps = {
  children: ReactNode;
};

export default function FirebaseAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Register a new user and set the display name.
   * @param email
   * @param password
   * @param displayName
   * @param onSuccess function to call on success
   * @param onFailure function to call on failure
   */
  const register = async (
    email: string,
    password: string,
    displayName: string,
    onSuccess: () => void,
    onFailure: () => void,
  ) => {
    setLoading(true);
    try {
      // Create the new user account
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // Set the display name for the user
      await updateProfile(res.user, { displayName });
      // Reload the user to get the updated display name
      await res.user.reload();
      // Update user with the latest information
      setUser({
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
      });
      onSuccess();
    } catch (error) {
      setLoading(false);
      setError(getErrorForDisplay(error));
      onFailure();
    }
  };

  /**
   * Login a user with email and password.
   * @param email
   * @param password
   * @param onSuccess function to call on success
   * @param onFailure function to call on failure
   */
  const login = async (
    email: string,
    password: string,
    onSuccess: () => void,
    onFailure: () => void,
  ) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (error) {
      setLoading(false);
      setError(getErrorForDisplay(error));
      onFailure();
    }
  };

  /**
   * Logout the current user.
   */
  const logout = () => {
    setLoading(true);
    signOut(auth).catch((error) => {
      setError(getErrorForDisplay(error));
      setLoading(false);
    });
  };

  /**
   * Clear the current error message.
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Reset the password for a user.
   * @param email
   */
  const resetPassword = async (
    email: string,
    onSuccess: () => void,
    onFailure: () => void,
  ) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      onSuccess();
    } catch (error) {
      setError(getErrorForDisplay(error));
      setLoading(false);
      onFailure();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
