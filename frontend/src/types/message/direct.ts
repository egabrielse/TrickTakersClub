import { Message } from "ably";
import { DIRECT_TYPES } from "../../constants/message";
import { GameSettings, HandPhase, Scoreboard, Trick, TrickSummary } from "../game";
import { PlayingCard } from "../card";

export interface ErrorMessage extends Message {
    name: typeof DIRECT_TYPES.ERROR;
    data: { message: string };
}

export interface RefreshMessage extends Message {
    name: typeof DIRECT_TYPES.REFRESH;
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
        blindSize?: number;
        phase?: HandPhase;
        upNextId?: string;
        pickerId?: string;
        partnerId?: string;
        currentTrick?: Trick;
        summaries?: TrickSummary[],
        hand?: PlayingCard[];
        bury?: PlayingCard[];
    };
}

export interface DealHandMessage extends Message {
    name: typeof DIRECT_TYPES.DEAL_HAND;
    data: {
        dealerId: string;
        cards: PlayingCard[];
        blindSize: number;
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
    ErrorMessage | RefreshMessage | DealHandMessage | PickedCardsMessage | BuriedCardsMessage
);