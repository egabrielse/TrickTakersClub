import { v4 as uuid } from "uuid";
import { BuryCommand, CallCommand, CallLastHandCommand, CommandMessage, PlayCardCommand, StartGameCommand, UpdateCallingMethodCommand, UpdateDoubleOnTheBumpCommand, UpdateNoPickResolutionCommand } from "../types/message/command";
import { MessageData } from "../types/message";
import { COMMAND_TYPES, MISC_TYPES } from "../constants/message";
import { BaseMessage } from "../types/message/base";
import { ChatMessage } from "../types/message/misc";

function newBaseMessage(): BaseMessage {
    return {
        id: uuid(),
        senderId: "", // This will be set when sending the message
        receiverId: "", // This will be set when sending the message
        messageType: "",
        data: undefined,
        timestamp: new Date().toISOString(),
    };
}

export function newChatMessage(data: MessageData<ChatMessage>): ChatMessage {
    const message = newBaseMessage();
    message.messageType = MISC_TYPES.CHAT;
    message.data = data;
    return {
        ...message,
        messageType: MISC_TYPES.CHAT,
        data: data,
    };
}

export function newUpdateCallingMethodCommand(data: MessageData<UpdateCallingMethodCommand>): UpdateCallingMethodCommand {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.UPDATE_CALLING_METHOD,
        data: data,
    };
}

export function newUpdateNoPickResolutionCommand(data: MessageData<UpdateNoPickResolutionCommand>): UpdateNoPickResolutionCommand {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.UPDATE_NO_PICK_RESOLUTION,
        data: data,
    };
}

export function newUpdateDoubleOnTheBumpCommand(data: MessageData<UpdateDoubleOnTheBumpCommand>): UpdateDoubleOnTheBumpCommand {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.UPDATE_DOUBLE_ON_THE_BUMP,
        data: data,
    };
}

export function newStartGameCommand(): StartGameCommand {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.START_GAME,
        data: undefined,
    };
}

export function newEndGameCommand() {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.END_GAME,
        data: undefined,
    };
}

export function newBuryCommand(data: MessageData<BuryCommand>): BuryCommand {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.BURY,
        data: data,
    };
}

export function newCallCommand(data: MessageData<CallCommand>): CallCommand {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.CALL,
        data: data,
    };
}

export function newGoAloneCommand(): CommandMessage {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.GO_ALONE,
        data: undefined,
    };
}

export function newPickCommand(): CommandMessage {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.PICK,
        data: undefined,
    };
}

export function newPassCommand(): CommandMessage {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.PASS,
        data: undefined,
    };
}

export function newPlayCardCommand(data: MessageData<PlayCardCommand>): PlayCardCommand {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.PLAY_CARD,
        data: data,
    };
}

export function newCallLastHandCommand(): CallLastHandCommand {
    const message = newBaseMessage();
    return {
        ...message,
        messageType: COMMAND_TYPES.CALL_LAST_HAND,
        data: undefined,
    };
}