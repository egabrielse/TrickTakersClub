import { Message } from "ably";
import { DIRECT_TYPES } from "../../constants/message";
import { GameSettings, HandPhase, Scoreboard, Trick } from "../game";
import { PlayingCard } from "../card";

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
        handsPlayed?: number;
        calledCard?: PlayingCard;
        phase?: HandPhase;
        upNextId?: string;
        pickerId?: string;
        partnerId?: string;
        tricks: Trick[];
        hand?: PlayingCard[];
        bury?: PlayingCard[];
    };
}

export interface DealHandMessage extends Message {
    name: typeof DIRECT_TYPES.DEAL_HAND;
    data: {
        dealerId: string;
        cards: PlayingCard[];
    };
}

export interface PickedCardsMessage extends Message {
    name: typeof DIRECT_TYPES.PICKED_CARDS;
    data: {
        cards: PlayingCard[];
    };
}

export interface BuriedCardsMessage extends Message {
    name: typeof DIRECT_TYPES.BURIED_CARDS;
    data: {
        cards: PlayingCard[];
    };
}


export type DirectMessage = (
    ErrorMessage | InitializeMessage | DealHandMessage | PickedCardsMessage | BuriedCardsMessage
);