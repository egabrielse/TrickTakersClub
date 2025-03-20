import { Message } from "ably";
import { DIRECT_TYPES } from "../../constants/message";
import { GameSettings, HandPhase, Scoreboard, Trick } from "../game";
import { Card } from "../card";

export interface ErrorMessage extends Message {
    name: typeof DIRECT_TYPES.ERROR;
    data: { message: string };
}

export interface InitializeMessage extends Message {
    name: typeof DIRECT_TYPES.INITIALIZE;
    data: {
        playerId: string;
        tableId: string;
        hostId: string;
        seating: string[];
        settings: GameSettings;
        inProgress: boolean;
        dealerId?: string;
        scoreboard?: Scoreboard;
        playerOrder?: string[];
        calledCard?: Card;
        phase?: HandPhase;
        upNextId?: string;
        pickerId?: string;
        partnerId?: string;
        tricks: Trick[];
        hand?: Card[];
        bury?: Card[];
        noPickHand?: boolean;
        isLastHand: boolean;
    };
}

export interface DealHandMessage extends Message {
    name: typeof DIRECT_TYPES.DEAL_HAND;
    data: {
        dealerId: string;
        cards: Card[];
        pickOrder: string[];
    };
}

export interface PickedCardsMessage extends Message {
    name: typeof DIRECT_TYPES.PICKED_CARDS;
    data: {
        cards: Card[];
    };
}

export interface BuriedCardsMessage extends Message {
    name: typeof DIRECT_TYPES.BURIED_CARDS;
    data: {
        cards: Card[];
    };
}


export type DirectMessage = (
    ErrorMessage | InitializeMessage | DealHandMessage | PickedCardsMessage | BuriedCardsMessage
);