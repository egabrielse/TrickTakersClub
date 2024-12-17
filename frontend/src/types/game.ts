import { CALLING_METHODS, HAND_PHASES, NO_PICK_RESOLUTIONS } from "../constants/game";

export type CallingMethod = typeof CALLING_METHODS[keyof typeof CALLING_METHODS];

export type NoPickResolution = typeof NO_PICK_RESOLUTIONS[keyof typeof NO_PICK_RESOLUTIONS];

export type GameSettings = {
    autoDeal: boolean;
    playerCount: number;
    callingMethod: CallingMethod;
    noPickResolution: NoPickResolution;
    doubleOnTheBump: boolean;
    blitzing: boolean;
}

export type PlayingCard = {
    suit: string;
    rank: number;
}

export type HandPhase = typeof HAND_PHASES[keyof typeof HAND_PHASES];

export type ScoreboardRow = {
    score: number;
    totalPoints: number;
    totalTricks: number;
};

export type Scoreboard = Record<string, ScoreboardRow>;

export type PlayerHandState = {
    hand: PlayingCard[];
    bury: PlayingCard[];
}

export type TrickState = {
    upNextIndex: number;
    takerIndex: number;
    turnOrder: string[];
    cards: PlayingCard[];
}

export type HandState = {
    calledCard: PlayingCard | null;
    cardsInBlind: number;
    phase: HandPhase;
    pickerId: string;
    partnerId: string;
    tricks: TrickState[];
    upNextId: string;
}

export type GameState = {
    dealerIndex: number;
    scoreboard: Scoreboard;
    playerOrder: string[];
    handsPlayed: number;
    settings: GameSettings;
}
