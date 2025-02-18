import { createContext } from "react";

const AuthContext = createContext<{
  initialized: boolean;
}>({
  initialized: false,
});

export default AuthContext;
