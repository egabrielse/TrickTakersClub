import { connectAuthEmulator, getAuth } from "firebase/auth";
import firebase from "./firebase";

const auth = getAuth(firebase);

// If the VITE_FIREBASE_AUTH_EMULATOR_HOST environment variable is set, connect to the local Firebase Auth emulator
if (import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST) {
    console.log(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST)
    connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST);
}

export default auth;