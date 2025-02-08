import { createContext } from "react";
import { CommandMessage } from "../../../types/message/command";

const ConnectionContext = createContext<{
  sendChatMsg: (message: string) => void;
  sendCommand: (command: CommandMessage) => void;
}>({
  sendChatMsg: () => {},
  sendCommand: () => {},
});

export default ConnectionContext;
