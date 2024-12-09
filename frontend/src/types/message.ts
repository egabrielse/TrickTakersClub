import { MESSAGE_TYPES } from "../constants/message";

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
