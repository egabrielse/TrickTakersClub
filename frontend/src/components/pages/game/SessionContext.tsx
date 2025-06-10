import { createContext } from "react";
import { CONNECTION_STATUS } from "../../../constants/socket";
import { UnknownMessage } from "../../../types/message/base";
import { CommandMessage } from "../../../types/message/command";
import { EventMessage } from "../../../types/message/event";
import { ChatMessage } from "../../../types/message/misc";
import { ConnectionStatus } from "../../../types/socket";

const SessionContext = createContext<{
  status: ConnectionStatus;
  sendCommand: (message: CommandMessage) => void;
  sendChatMsg: (message: string) => void;
  getNextMessage: () => EventMessage | ChatMessage | UnknownMessage | null;
  messageCount: number;
}>({
  status: CONNECTION_STATUS.DISCONNECTED,
  sendCommand: () => {},
  sendChatMsg: () => {},
  getNextMessage: () => null,
  messageCount: 0,
});

export default SessionContext;
