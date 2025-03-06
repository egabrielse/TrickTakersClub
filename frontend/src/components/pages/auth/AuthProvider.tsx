import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import auth from "../../../firebase/auth";

import { useAppDispatch } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import settingsSlice from "../../../store/slices/settings.slice";
import AuthContext from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!initialized) {
        setInitialized(true);
      }
      if (user) {
        const token = await user.getIdToken();
        dispatch(authSlice.actions.setToken(token));
        dispatch(
          authSlice.actions.setUser({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
          }),
        );
        dispatch(settingsSlice.actions.asyncFetchUserSettings());
      } else {
        dispatch(authSlice.actions.reset());
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ initialized }}>
      {children}
    </AuthContext.Provider>
  );
}
