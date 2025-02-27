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
    PartnerRevealedMessage,
    TrickDoneMessage,
} from "./message/broadcast";

export type CallingMethod = typeof CALLING_METHODS[keyof typeof CALLING_METHODS]['ID'];

export type NoPickResolution = typeof NO_PICK_RESOLUTIONS[keyof typeof NO_PICK_RESOLUTIONS]['ID'];

export type GameSettings = {
    autoDeal: boolean;
    callingMethod: CallingMethod;
    noPickResolution: NoPickResolution;
    doubleOnTheBump: boolean;
};

export type HandPhase = (typeof HAND_PHASE)[keyof typeof HAND_PHASE];

export type ScoreboardRow = {
    playerId: string;
    score: number;
    totalPoints: number;
    totalTricks: number;
};

export type Scoreboard = Array<ScoreboardRow>;

export type TrickSummary = {
    takerId: string;
    cards: Record<string, PlayingCard>;
    points: number;
    complete: boolean;
};

export type BurySummary = {
    cards: PlayingCard[];
    points: number;
};

export type PlayerSummary = {
    score: number;
    points: number;
    tricks: number;
};

export type HandSummary = {
    winners: string[];
    winningTeam: "picking" | "opponents";
    playerSummaries: Record<string, PlayerSummary>;
    pickerId: string;
    partnerId: string;
    opponentIds: string[];
    burySummary: BurySummary;
    trickSummaries: TrickSummary[];
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
    | TrickDoneMessage;
