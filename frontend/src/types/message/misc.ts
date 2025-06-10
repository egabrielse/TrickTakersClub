import { MISC_TYPES } from "../../constants/message";
import { BaseMessage } from "./base";

export interface ChatMessage extends BaseMessage {
    messageType: typeof MISC_TYPES.CHAT;
    data: { message: string };
}

export type MiscMessage = ChatMessage;

export type MiscMessageType = typeof MISC_TYPES[keyof typeof MISC_TYPES];