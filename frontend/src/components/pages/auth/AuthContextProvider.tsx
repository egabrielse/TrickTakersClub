import * as Ably from "ably";
import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import auth from "../../../firebase/auth";

import { AblyProvider } from "ably/react";
import { fetchAblyToken } from "../../../api/ably.api";
import { UserEntity } from "../../../types/user";

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<{
  initialized: boolean;
  token: string | null;
  user: UserEntity | null;
  ably: Ably.Realtime | null;
}>({
  initialized: false,
  token: null,
  user: null,
  ably: null,
});

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserEntity | null>(null);
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);

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
        const newAblyClient = new Ably.Realtime({
          authCallback: async (_, callback) => {
            try {
              const result = await fetchAblyToken();
              callback(null, result.tokenRequest);
            } catch (error) {
              callback(error as string, null);
              return;
            }
          },
          clientId: user!.uid,
        });
        setAbly(newAblyClient);
      } else {
        setUser(null);
        setToken(null);
        ably?.close();
        setAbly(null);
      }
    });
    return () => {
      unsubscribe();
      if (ably) {
        ably.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ initialized, token, user, ably }}>
      {ably === null ? (
        children
      ) : (
        <AblyProvider client={ably}>{children}</AblyProvider>
      )}
    </AuthContext.Provider>
  );
}
