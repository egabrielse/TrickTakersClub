import { Message } from "ably";
import { MESSAGE_TYPES } from "../constants/message";
import {
    GameSettings,
    GameState,
    HandPhase,
    HandState,
    PlayerHandState,
    PlayingCard,
    Scoreboard
} from "./game";

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
        tableId: string;
        hostId: string;
        gameState?: GameState,
        handState?: HandState,
        playerHandState?: PlayerHandState,
    };
}

export interface NewGameMessage extends Message {
    name: typeof MESSAGE_TYPES.NEW_GAME;
    data: {
        settings: GameSettings;
        playerOrder: string[];
        blindSize: number;
    };
}

export interface GameStartedMessage extends Message {
    name: typeof MESSAGE_TYPES.GAME_STARTED;
    data: {
        scoreboard: Scoreboard;
        playerOrder: string[];
    };
}

export interface GameOverMessage extends Message {
    name: typeof MESSAGE_TYPES.GAME_OVER;
    data: undefined;
}

export interface DealHandMessage extends Message {
    name: typeof MESSAGE_TYPES.DEAL_HAND;
    data: {
        dealerId: string;
        cards: PlayingCard[];
    };
}
export interface UpNextMessage extends Message {
    name: typeof MESSAGE_TYPES.UP_NEXT;
    data: {
        playerId: string;
        phase: HandPhase;
    };
}

export interface PickPayload extends Message {
    name: typeof MESSAGE_TYPES.PICK;
    data: {
        cards: PlayingCard[];
    };
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
    GameOverMessage |
    DealHandMessage |
    UpNextMessage |
    PickPayload
);