import * as Ably from "ably";
import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import auth from "../../../firebase/auth";

import { AblyProvider } from "ably/react";
import { fetchAblyToken } from "../../../api/ably.api";
import { useAppDispatch } from "../../../store/hooks";
import authSlice from "../../../store/slices/auth.slice";
import AuthContext from "./AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState<boolean>(false);
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!initialized) {
        setInitialized(true);
      }
      if (user) {
        dispatch(authSlice.actions.setToken(await user.getIdToken()));
        dispatch(
          authSlice.actions.setUser({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
          }),
        );
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
        dispatch(authSlice.actions.reset());
        ably?.close();
        setAbly(null);
      }
    });
    return () => {
      unsubscribe();
      if (ably) {
        console.log("Closing Ably connection");
        ably.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ initialized }}>
      {ably === null ? (
        children
      ) : (
        <AblyProvider client={ably}>{children}</AblyProvider>
      )}
    </AuthContext.Provider>
  );
}
