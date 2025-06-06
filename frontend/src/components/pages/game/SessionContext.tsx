import { createContext } from "react";
import { CONNECTION_STATUS } from "../../../constants/socket";
import { Message } from "../../../types/message";
import { ConnectionStatus } from "../../../types/socket";

const SessionContext = createContext<{
  status: ConnectionStatus;
  sendMessage: (message: Message) => void;
  getNextMessage: () => Message | null;
  messageCount: number;
}>({
  status: CONNECTION_STATUS.DISCONNECTED,
  sendMessage: () => {},
  getNextMessage: () => null,
  messageCount: 0,
});

export default SessionContext;
