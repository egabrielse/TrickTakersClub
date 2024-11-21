import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import auth from "../../../firebase/auth";
import { UserEntity } from "../../../types/user";

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<{
  initialized: boolean;
  token: string | null;
  user: UserEntity | null;
}>({
  initialized: false,
  token: null,
  user: null,
});

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserEntity | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
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
        setUser(null);
        setToken(null);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ initialized, token, user }}>
      {children}
    </AuthContext.Provider>
  );
}
