import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import auth from "./auth";

// Used to wait for the initial Firebase Auth state to be loaded.
// Once loaded, the user can be redirected to the correct page.
export const useFirebaseAuth = () => {
    // State to track if Firebase Auth has been initialized
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            if (initialized) return;
            setInitialized(true);
        });
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return initialized;
}