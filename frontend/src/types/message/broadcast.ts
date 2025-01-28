import { Message } from "ably";
import { BROADCAST_TYPES } from "../../constants/message";
import {
    GameSettings,
    HandPhase,
    PlayingCard,
    Scoreboard
} from "../game";

export interface BlindPickedMessage extends Message {
    name: typeof BROADCAST_TYPES.BLIND_PICKED;
    data: { playerId: string };
}

export interface CalledCardMessage extends Message {
    name: typeof BROADCAST_TYPES.CALLED_CARD;
    data: { alone: boolean, card: PlayingCard };
}

export interface ChatMessage extends Message {
    name: typeof BROADCAST_TYPES.CHAT;
    data: { message: string };
}


export interface ErrorMessage extends Message {
    name: typeof BROADCAST_TYPES.ERROR;
    data: { message: string };
}

export interface GameOverMessage extends Message {
    name: typeof BROADCAST_TYPES.GAME_OVER;
    data: undefined;
}

export interface GameStartedMessage extends Message {
    name: typeof BROADCAST_TYPES.GAME_STARTED;
    data: {
        scoreboard: Scoreboard;
        playerOrder: string[];
    };
}

export interface GoAloneMessage extends Message {
    name: typeof BROADCAST_TYPES.GO_ALONE;
    data: undefined;
}

export interface HandDoneMessage extends Message {
    name: typeof BROADCAST_TYPES.HAND_DONE;
    data: undefined; // TODO: HandSummary
}

export interface PartnerRevealedMessage extends Message {
    name: typeof BROADCAST_TYPES.PARTNER_REVEALED;
    data: { playerId: string };
}

export interface SatDownMessage extends Message {
    name: typeof BROADCAST_TYPES.SAT_DOWN;
    data: { playerId: string };
}

export interface SettingsUpdatedMessage extends Message {
    name: typeof BROADCAST_TYPES.SETTINGS_UPDATED;
    data: { settings: GameSettings, seating: string[] };
}

export interface StoodUpMessage extends Message {
    name: typeof BROADCAST_TYPES.STOOD_UP;
    data: { playerId: string };
}

export interface TimeoutMessage extends Message {
    name: typeof BROADCAST_TYPES.TIMEOUT;
    data: undefined;
}

export interface TrickDoneMessage extends Message {
    name: typeof BROADCAST_TYPES.TRICK_DONE;
    data: undefined; // TODO: TrickSummary
}

export interface UpNextMessage extends Message {
    name: typeof BROADCAST_TYPES.UP_NEXT;
    data: {
        playerId: string;
        phase: HandPhase;
    };
}

export type BroadcastMessage = (
    BlindPickedMessage |
    CalledCardMessage |
    ChatMessage |
    ErrorMessage |
    GameOverMessage |
    GameStartedMessage |
    GoAloneMessage |
    HandDoneMessage |
    PartnerRevealedMessage |
    SatDownMessage |
    SettingsUpdatedMessage |
    StoodUpMessage |
    TimeoutMessage |
    TrickDoneMessage |
    UpNextMessage
);