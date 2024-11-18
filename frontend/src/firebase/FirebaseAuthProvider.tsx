import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import authActions from "../redux/features/auth/actions";
import { useAppDispatch } from "../redux/hooks";
import auth from "./auth";

type FirebaseAuthProviderProps = {
  children: ReactNode;
};

export default function FirebaseAuthProvider({
  children,
}: FirebaseAuthProviderProps) {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (initialized) {
        return;
      } else if (user === null) {
        dispatch(authActions.initializeUser({ user: null }));
        setInitialized(true);
      } else {
        dispatch(
          authActions.initializeUser({
            user: {
              uid: user.uid,
              email: String(user.email),
              displayName: String(user.displayName),
            },
          }),
        );
        setInitialized(true);
      }
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
