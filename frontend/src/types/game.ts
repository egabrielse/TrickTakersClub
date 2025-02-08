import { CALLING_METHODS, HAND_PHASE, NO_PICK_RESOLUTIONS } from "../constants/game";
import { PlayingCard } from "./card";

export type CallingMethod = typeof CALLING_METHODS[keyof typeof CALLING_METHODS];

export type NoPickResolution = typeof NO_PICK_RESOLUTIONS[keyof typeof NO_PICK_RESOLUTIONS];

export type GameSettings = {
    autoDeal: boolean;
    playerCount: number;
    callingMethod: CallingMethod;
    noPickResolution: NoPickResolution;
    doubleOnTheBump: boolean;
}

export type HandPhase = typeof HAND_PHASE[keyof typeof HAND_PHASE];

export type ScoreboardRow = {
    playerId: string;
    score: number;
    totalPoints: number;
    totalTricks: number;
};

export type Scoreboard = Array<ScoreboardRow>;

export type TrickSummary = {
    takerId: string;
    cards: PlayingCard[];
    points: number;
    complete: boolean;
}

export type BurySummary = {
    cards: PlayingCard[];
    complete: boolean;
}

export type PlayerSummary = {
    score: number;
    points: number;
    tricks: number;
}

export type HandSummary = {
    winners: string[];
    playerSummaries: Record<string, PlayerSummary>;
    pickerId: string;
    burySummary: BurySummary;
    trickSummaries: TrickSummary[];
}

export type Trick = {
    turnOrder: string[];
    cards: Record<string, PlayingCard>;
}