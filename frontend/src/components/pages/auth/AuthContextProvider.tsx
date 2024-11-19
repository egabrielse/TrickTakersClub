import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import auth from "../../../firebase/auth";
import { User } from "../../../types/user";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<{
  initialized: boolean;
  token: string | null;
  user: User | null;
}>({
  initialized: false,
  token: null,
  user: null,
});

export default function AuthContextProvider({ children }: AuthProviderProps) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: FirebaseUser | null) => {
        if (!initialized) {
          setInitialized(true);
        }
        if (user) {
          setUser({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
          });
          setToken(await user.getIdToken());
        } else {
          setUser;
          setToken(null);
          setUser;
        }
      },
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ initialized, token, user }}>
      {children}
    </AuthContext.Provider>
  );
}
