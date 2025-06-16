import { COMMAND_TYPES } from "../../constants/message";
import { Card } from "../card";
import { CallingMethod, NoPickResolution } from "../game";
import { BaseMessage } from "./base";

export interface UpdateCallingMethodCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.UPDATE_CALLING_METHOD;
    data: {
        callingMethod: CallingMethod | string;
    }
}

export interface UpdateNoPickResolutionCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.UPDATE_NO_PICK_RESOLUTION;
    data: {
        noPickResolution: NoPickResolution | string;
    }
}

export interface UpdateDoubleOnTheBumpCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.UPDATE_DOUBLE_ON_THE_BUMP;
    data: {
        doubleOnTheBump: boolean;
    }
}

export interface StartGameCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.START_GAME;
    data: undefined;
}

export interface EndGameCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.END_GAME;
    data: undefined;
}

export interface BuryCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.BURY;
    data: { cards: Card[] };
}

export interface CallCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.CALL;
    data: { card: Card };
}

export interface GoAloneCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.GO_ALONE;
    data: undefined;
}

export interface PickCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.PICK;
    data: undefined;
}

export interface PassCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.PASS;
    data: undefined;
}

export interface PlayCardCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.PLAY_CARD;
    data: { card: Card };
}

export interface CallLastHandCommand extends BaseMessage {
    messageType: typeof COMMAND_TYPES.CALL_LAST_HAND;
    data: undefined;
}


export type CommandMessageType = typeof COMMAND_TYPES[keyof typeof COMMAND_TYPES];

export type CommandMessage =
    | UpdateCallingMethodCommand
    | UpdateNoPickResolutionCommand
    | UpdateDoubleOnTheBumpCommand
    | StartGameCommand
    | EndGameCommand
    | BuryCommand
    | CallCommand
    | GoAloneCommand
    | PickCommand
    | PassCommand
    | PlayCardCommand
    | CallLastHandCommand;