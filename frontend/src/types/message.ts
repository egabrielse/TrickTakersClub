import { MESSAGE_TYPES } from "../constants/message";
import { Card } from "./card";
import { GameSettings, Scoreboard, Trick } from "./game";

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

export type BaseMessage = {
    senderId: string;           // User id of sender
    receiverId: string;         // User id of receiver
    messageType: MessageType;   // Type of message
    payload: unknown;           // Message payload as raw JSON
    timestamp: string;          // ISO string for timestamp
};

// ### SYSTEM MESSAGES ###
export interface TimeoutMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.TIMEOUT;
    payload: undefined;
}
export interface ErrorMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.ERROR;
    payload: { message: string };
}

export interface UpdateSettingsMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.UPDATE_SETTINGS;
    payload: {
        settings: GameSettings;
    }
}

export interface SettingsUpdatedMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.SETTINGS_UPDATED;
    payload: {
        settings: GameSettings;
    }
}

export interface CallLastHandMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.CALL_LAST_HAND;
    payload: {
        playerId: string;
    }
}

export interface LastHandMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.LAST_HAND;
    payload: {
        playerId: string;
    }
}

// ### ACTION MESSAGES ###
export interface WelcomeMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.WELCOME;
    payload: {
        sessionId: string;
        hostId: string;
        presence: string[];
        inProgress: boolean;
        isLastHand: boolean;
        dealerId: string;
        scoreboard: Scoreboard;
        playerOrder: string[];
        settings?: GameSettings;
        calledCard?: Card;
        upNextId: string;
        pickerId: string;
        partnerId: string;
        tricks: Trick[];
        hand: Card[];
        bury: Card[];
        noPickHand: boolean;
    }
}

export interface EnteredMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.ENTERED;
    payload: {
        playerId: string;
    }
}

export interface LeftMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.LEFT;
    payload: {
        playerId: string;
    }
}

export interface BuryMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.BURY;
    payload: { cards: Card[] };
}

export interface CallMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.CALL;
    payload: { card: Card };
}

export interface EndGameMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.END_GAME;
    payload: undefined;
}

export interface GoAloneCommand extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.GO_ALONE;
    payload: undefined;
}

export interface PassMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.PASS;
    payload: undefined;
}

export interface PlayCardMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.PLAY_CARD;
    payload: { card: Card };
}

export interface PickMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.PICK;
    payload: undefined;
}

export interface StartGameMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.START_GAME;
    payload: undefined;
}

// ### EVENT MESSAGES ###


// ### MISC MESSAGES ###
export interface ChatMessage extends BaseMessage {
    messageType: typeof MESSAGE_TYPES.CHAT;
    payload: { message: string; };
}


export type Message =
    | ErrorMessage
    | ChatMessage
    | TimeoutMessage
    | WelcomeMessage
    | EnteredMessage
    | LeftMessage;