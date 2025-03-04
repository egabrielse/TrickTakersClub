import { Message } from "ably";
import { BROADCAST_TYPES } from "../../constants/message";
import {
    GameSettings,
    HandPhase,
    HandSummary,
    Scoreboard,
} from "../game";
import { Card } from "../card";

export interface BlindPickedMessage extends Message {
    name: typeof BROADCAST_TYPES.BLIND_PICKED;
    data: { playerId: string, forcePick: boolean };
}

export interface CalledCardMessage extends Message {
    name: typeof BROADCAST_TYPES.CALLED_CARD;
    data: { card: Card };
}

export interface CardPlayedMessage extends Message {
    name: typeof BROADCAST_TYPES.CARD_PLAYED;
    data: { playerId: string, card: Card };
}

export interface ChatMessage extends Message {
    clientId: string | undefined;
    timestamp: number | undefined;
    name: typeof BROADCAST_TYPES.CHAT;
    data: { message: string };
}


export interface ErrorMessage extends Message {
    name: typeof BROADCAST_TYPES.ERROR;
    data: { message: string };
}

export interface LastHandStatusMessage extends Message {
    name: typeof BROADCAST_TYPES.LAST_HAND_STATUS;
    data: { playerId: string, lastHand: boolean };
}

export interface GameOverMessage extends Message {
    name: typeof BROADCAST_TYPES.GAME_OVER;
    data: { scoreboard: Scoreboard };
}

export interface GameStartedMessage extends Message {
    name: typeof BROADCAST_TYPES.GAME_STARTED;
    data: {
        playerOrder: string[];
    };
}

export interface GoneAloneMessage extends Message {
    name: typeof BROADCAST_TYPES.GONE_ALONE;
    data: { forced: boolean };
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
    data: { settings: GameSettings };
}

export interface StoodUpMessage extends Message {
    name: typeof BROADCAST_TYPES.STOOD_UP;
    data: { playerId: string };
}

export interface TimeoutMessage extends Message {
    name: typeof BROADCAST_TYPES.TIMEOUT;
    data: undefined;
}

export interface TrickWonMessage extends Message {
    name: typeof BROADCAST_TYPES.TRICK_WON;
    data: { playerId: string };
}

export interface HandDoneMessage extends Message {
    name: typeof BROADCAST_TYPES.HAND_DONE;
    data: {
        summary: HandSummary;
    }
}

export interface NewTrickMessage extends Message {
    name: typeof BROADCAST_TYPES.NEW_TRICK;
    data: {
        nextTrickOrder: string[];
    };
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
    CardPlayedMessage |
    ChatMessage |
    ErrorMessage |
    LastHandStatusMessage |
    GameOverMessage |
    GameStartedMessage |
    GoneAloneMessage |
    PartnerRevealedMessage |
    SatDownMessage |
    SettingsUpdatedMessage |
    StoodUpMessage |
    TimeoutMessage |
    TrickWonMessage |
    HandDoneMessage |
    NewTrickMessage |
    UpNextMessage
);