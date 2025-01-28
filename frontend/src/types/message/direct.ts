import { Message } from "ably";
import { DIRECT_TYPES } from "../../constants/message";
import { GameSettings, PlayingCard, Scoreboard, Trick } from "../game";

export interface ErrorMessage extends Message {
    name: typeof DIRECT_TYPES.ERROR;
    data: { message: string };
}

export interface RefreshMessage extends Message {
    name: typeof DIRECT_TYPES.REFRESH;
    data: {
        seating: string[];
        gameInProgress: boolean;
        dealerId: string;
        scoreboard: Scoreboard;
        playerOrder: string[];
        handsPlayed: number;
        settings: GameSettings;
        calledCard: PlayingCard;
        blindSize: number;
        phase: string;
        upNextId: string;
        pickerId: string;
        partnerId: string;
        tricks: Trick[];
        clientIsPlayer: boolean;
        hand: PlayingCard[];
        bury: PlayingCard[];
    };
}

export interface DealHandMessage extends Message {
    name: typeof DIRECT_TYPES.DEAL_HAND;
    data: {
        dealerId: string;
        cards: PlayingCard[];
    };
}

export interface PickedCards extends Message {
    name: typeof DIRECT_TYPES.PICKED_CARDS;
    data: {
        cards: PlayingCard[];
    };
}

export interface BuriedCards extends Message {
    name: typeof DIRECT_TYPES.BURIED_CARDS;
    data: {
        cards: PlayingCard[];
    };
}


export type DirectMessage = (
    ErrorMessage | RefreshMessage | DealHandMessage | PickedCards | BuriedCards
);