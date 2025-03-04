import {
    CALLING_METHODS,
    HAND_PHASE,
    NO_PICK_RESOLUTIONS,
} from "../constants/game";
import { PlayingCard } from "./card";
import {
    BlindPickedMessage,
    CalledCardMessage,
    CardPlayedMessage,
    GoneAloneMessage,
    HandDoneMessage,
    PartnerRevealedMessage,
    TrickWonMessage,
} from "./message/broadcast";

export type TestFrontendChange = "foobar";

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
    playerId: string;
    score: number;
    totalPoints: number;
    totalTricks: number;
};

export type Scoreboard = Array<ScoreboardRow>;

export type HandSummary = {
    winners: string[];
    pickerId: string;
    partnerId: string;
    opponentIds: string[];
    tricks: Trick[];
    bury: PlayingCard[];
    scores: Record<string, number>;
    pointsWon: Record<string, number>;
    tricksWon: Record<string, number>;
};

export type Trick = {
    turnOrder: string[];
    cards: Record<string, PlayingCard>;
};

export type UpdateMessages =
    | BlindPickedMessage
    | CalledCardMessage
    | GoneAloneMessage
    | CardPlayedMessage
    | PartnerRevealedMessage
    | TrickWonMessage
    | HandDoneMessage;
