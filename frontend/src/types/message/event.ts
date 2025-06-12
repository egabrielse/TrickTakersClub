import { EVENT_TYPES } from "../../constants/message";
import { Card } from "../card";
import { GameSettings, HandPhase, HandSummary, Scoreboard, Trick } from "../game";
import { BaseMessage } from "./base";

export interface TimeoutEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.TIMEOUT;
    data: undefined;
}

export interface ErrorEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.ERROR;
    data: { message: string };
}

export interface WelcomeEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.WELCOME;
    data: {
        sessionId: string;
        hostId: string;
        presence: string[];
        inProgress: boolean;
        isLastHand: boolean;
        dealerId: string;
        scoreboard: Scoreboard;
        seating: string[];
        settings?: GameSettings;
        calledCard?: Card;
        upNextId: string;
        pickerId: string;
        partnerId: string;
        phase: HandPhase;
        tricks: Trick[];
        hand: Card[];
        bury: Card[];
        noPickHand: boolean;
    }
}

export interface SettingsUpdatedEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.SETTINGS_UPDATED;
    data: {
        settings: GameSettings;
    }
}

export interface EnteredEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.ENTERED;
    data: {
        playerId: string;
        seating: string[];
    }
}

export interface LeftEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.LEFT;
    data: {
        playerId: string;
        seating: string[];
    }
}

export interface GameOnEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.GAME_ON;
    data: {
        seating: string[];
    };
}

export interface GameOverEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.GAME_OVER;
    data: { scoreboard: Scoreboard };
}

export interface BlindPickedEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.BLIND_PICKED;
    data: { playerId: string, forcePick: boolean };
}

export interface CardCalledEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.CARD_CALLED;
    data: { card: Card };
}

export interface GoneAloneEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.GONE_ALONE;
    data: { forced: boolean };
}

export interface CardPlayedEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.CARD_PLAYED;
    data: { playerId: string, card: Card };
}

export interface PartnerRevealedEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.PARTNER_REVEALED;
    data: { playerId: string };
}

export interface TrickWonEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.TRICK_WON;
    data: { playerId: string, blind?: Card[] };
}

export interface HandDoneEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.HAND_DONE;
    data: {
        summary: HandSummary;
        scoreboard: Scoreboard;
    }
}

export interface NewTrickEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.START_TRICK;
    data: {
        nextTrickOrder: string[];
    };
}

export interface UpNextEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.UP_NEXT;
    data: {
        playerId: string;
        phase: HandPhase;
    };
}

export interface NoPickHandEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.NO_PICK_HAND;
    data: undefined;
}

export interface DealHandEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.DEAL_HAND;
    data: {
        dealerId: string;
        cards: Card[];
        pickOrder: string[];
    };
}

export interface PickedCardsEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.PICKED_CARDS;
    data: {
        cards: Card[];
    };
}

export interface BuriedCardsEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.BURIED_CARDS;
    data: {
        cards: Card[];
    };
}

export interface LastHandEvent extends BaseMessage {
    messageType: typeof EVENT_TYPES.LAST_HAND;
    data: { playerId: string };
}

export type EventMessageType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export type EventMessage =
    ErrorEvent
    | WelcomeEvent
    | SettingsUpdatedEvent
    | EnteredEvent
    | LeftEvent
    | BlindPickedEvent
    | CardCalledEvent
    | CardPlayedEvent
    | LastHandEvent
    | GameOverEvent
    | GameOnEvent
    | GoneAloneEvent
    | PartnerRevealedEvent
    | TrickWonEvent
    | HandDoneEvent
    | NewTrickEvent
    | UpNextEvent
    | NoPickHandEvent
    | DealHandEvent
    | PickedCardsEvent
    | BuriedCardsEvent;