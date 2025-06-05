import { createContext } from "react";
import { CONNECTION_STATUS } from "../../../constants/socket";
import { ConnectionStatus } from "../../../types/socket";

const SessionContext = createContext<{
  connectionStatus: ConnectionStatus;
}>({
  connectionStatus: CONNECTION_STATUS.DISCONNECTED,
});

export default SessionContext;
