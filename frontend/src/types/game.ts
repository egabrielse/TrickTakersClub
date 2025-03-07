import {
    CALLING_METHODS,
    HAND_PHASE,
    NO_PICK_RESOLUTIONS,
} from "../constants/game";
import { Card } from "./card";
import {
    BlindPickedMessage,
    CalledCardMessage,
    CardPlayedMessage,
    GoneAloneMessage,
    HandDoneMessage,
    PartnerRevealedMessage,
    TrickWonMessage,
} from "./message/broadcast";

export type CallingMethod = typeof CALLING_METHODS[keyof typeof CALLING_METHODS]['ID'];

export type NoPickResolution = typeof NO_PICK_RESOLUTIONS[keyof typeof NO_PICK_RESOLUTIONS]['ID'];

export type GameSettings = {
    callingMethod: CallingMethod;
    noPickResolution: NoPickResolution;
    doubleOnTheBump: boolean;
    blitzing: boolean; // TODO: Implement
    cracking: boolean; // TODO: Implement
};

export type HandPhase = (typeof HAND_PHASE)[keyof typeof HAND_PHASE];

export type ScoreboardRow = {
    score: number;
    handsWon: number;
};

export type Scoreboard = Record<string, ScoreboardRow>;

export type HandSummary = {
    winners: string[];
    pickerId: string;
    partnerId: string;
    opponentIds: string[];
    tricks: Trick[];
    bury: Card[];
    payouts: Record<string, number>;
    payoutMultipliers: string[]
    pointsWon: Record<string, number>;
    tricksWon: Record<string, number>;
};

export type Trick = {
    turnOrder: string[];
    cards: Record<string, Card>;
};

export type UpdateMessages =
    | BlindPickedMessage
    | CalledCardMessage
    | GoneAloneMessage
    | CardPlayedMessage
    | PartnerRevealedMessage
    | TrickWonMessage
    | HandDoneMessage;
