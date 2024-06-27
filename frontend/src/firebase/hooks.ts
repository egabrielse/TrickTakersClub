import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import auth from "./auth";

const useFirebaseAuthentication = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        console.log(user);
      } else {
        setAuthUser(null);
        console.log("No user");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return authUser;
};

export default useFirebaseAuthentication;
