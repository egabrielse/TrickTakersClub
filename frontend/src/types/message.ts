import { Message } from "ably";
import { MESSAGE_TYPES } from "../constants/message";
import { GameSettings } from "./game";

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

export interface ChatMessage extends Message {
    name: typeof MESSAGE_TYPES.CHAT;
    data: string;
}

export interface TimeoutMessage extends Message {
    name: typeof MESSAGE_TYPES.TIMEOUT;
    data: undefined;
}

export interface ErrorMessage extends Message {
    name: typeof MESSAGE_TYPES.ERROR;
    data: string;
}

export interface SatDownMessage extends Message {
    name: typeof MESSAGE_TYPES.SAT_DOWN;
    data: string;
}

export interface StoodUpMessage extends Message {
    name: typeof MESSAGE_TYPES.STOOD_UP;
    data: string;
}

export interface RefreshMessage extends Message {
    name: typeof MESSAGE_TYPES.REFRESH;
    data: {
        game: {
            playerOrder: string[];
            settings: GameSettings;
        }
    };
}

export interface NewGameMessage extends Message {
    name: typeof MESSAGE_TYPES.NEW_GAME;
    data: {
        playerOrder: string[];
        settings: GameSettings;
    };
}

export interface GameStartedMessage extends Message {
    name: typeof MESSAGE_TYPES.GAME_STARTED;
    data: undefined;
}

export interface GameOverMessage extends Message {
    name: typeof MESSAGE_TYPES.GAME_OVER;
    data: undefined;
}

export type TypedMessage = (
    ChatMessage |
    TimeoutMessage |
    ErrorMessage |
    SatDownMessage |
    StoodUpMessage |
    RefreshMessage |
    NewGameMessage |
    GameStartedMessage |
    GameOverMessage
);