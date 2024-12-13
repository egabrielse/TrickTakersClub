import { COMMAND_TYPES } from "../constants/commands";
import { GameSettings } from "./game";

export type CommandTypes = typeof COMMAND_TYPES[keyof typeof COMMAND_TYPES];

interface Command {
    name: CommandTypes;
    data: object | string | undefined;
}

export interface SitDownCommand extends Command {
    name: typeof COMMAND_TYPES.SIT_DOWN;
    data: undefined;
}

export interface StandUpCommand extends Command {
    name: typeof COMMAND_TYPES.STAND_UP;
    data: undefined;
}


export interface CreateGameCommand extends Command {
    name: typeof COMMAND_TYPES.CREATE_GAME;
    data: GameSettings;
}

export interface EndGame extends Command {
    name: typeof COMMAND_TYPES.END_GAME;
    data: undefined;
}

export type TypedCommand = (
    SitDownCommand |
    StandUpCommand |
    CreateGameCommand |
    EndGame
);