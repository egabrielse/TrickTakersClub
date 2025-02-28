import { COMMAND_TYPES } from "../../constants/message";
import { Message } from "ably";
import { PlayingCard } from "../card";

export interface BuryCommand extends Message {
    name: typeof COMMAND_TYPES.BURY;
    data: { cards: PlayingCard[] };
}

export interface CallCommand extends Message {
    name: typeof COMMAND_TYPES.CALL;
    data: { card: PlayingCard };
}

export interface EndGameCommand extends Message {
    name: typeof COMMAND_TYPES.END_GAME;
    data: undefined;
}

export interface GoAloneCommand extends Message {
    name: typeof COMMAND_TYPES.GO_ALONE;
    data: undefined;
}

export interface PassCommand extends Message {
    name: typeof COMMAND_TYPES.PASS;
    data: undefined;
}

export interface PlayCardCommand extends Message {
    name: typeof COMMAND_TYPES.PLAY_CARD;
    data: { card: PlayingCard };
}

export interface PickCommand extends Message {
    name: typeof COMMAND_TYPES.PICK;
    data: undefined;
}

export interface StartGameCommand extends Message {
    name: typeof COMMAND_TYPES.START_GAME;
    data: undefined;
}

export interface SitDownCommand extends Message {
    name: typeof COMMAND_TYPES.SIT_DOWN;
    data: undefined;
}

export interface StandUpCommand extends Message {
    name: typeof COMMAND_TYPES.STAND_UP;
    data: undefined;
}

export interface UpdateCallingMethodCommand extends Message {
    name: typeof COMMAND_TYPES.UPDATE_CALLING_METHOD;
    data: { callingMethod: string };
}

export interface UpdateNoPickResolutionCommand extends Message {
    name: typeof COMMAND_TYPES.UPDATE_NO_PICK_RESOLUTION;
    data: { noPickResolution: string };
}

export interface UpdateDoubleOnTheBumpCommand extends Message {
    name: typeof COMMAND_TYPES.UPDATE_DOUBLE_ON_THE_BUMP;
    data: { doubleOnTheBump: boolean };
}

export type CommandMessage = (
    | BuryCommand
    | CallCommand
    | EndGameCommand
    | GoAloneCommand
    | PassCommand
    | PlayCardCommand
    | PickCommand
    | StartGameCommand
    | SitDownCommand
    | StandUpCommand
    | UpdateCallingMethodCommand
    | UpdateNoPickResolutionCommand
    | UpdateDoubleOnTheBumpCommand
);