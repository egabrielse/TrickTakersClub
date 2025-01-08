import { CALLING_METHOD, CARD_SIZE, CARD_SUIT, CARD_RANK, HAND_PHASE, NO_PICK_RESOLUTION } from "../constants/game";

export type CallingMethod = typeof CALLING_METHOD[keyof typeof CALLING_METHOD];

export type NoPickResolution = typeof NO_PICK_RESOLUTION[keyof typeof NO_PICK_RESOLUTION];

export type GameSettings = {
    autoDeal: boolean;
    playerCount: number;
    callingMethod: CallingMethod;
    noPickResolution: NoPickResolution;
    doubleOnTheBump: boolean;
}

export type PlayingCard = {
    suit: CardSuit;
    rank: CardRank;
}

export type HandPhase = typeof HAND_PHASE[keyof typeof HAND_PHASE];

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
    blindSize: number;
    phase: HandPhase;
    pickerId: string;
    partnerId: string;
    tricks: TrickState[];
    upNextId: string;
}

export type GameState = {
    dealerId: string;
    scoreboard: Scoreboard;
    playerOrder: string[];
    handsPlayed: number;
    settings: GameSettings;
}

export type CardSize = typeof CARD_SIZE[keyof typeof CARD_SIZE];

export type CardRank = typeof CARD_RANK[keyof typeof CARD_RANK];
export type CardSuit = typeof CARD_SUIT[keyof typeof CARD_SUIT];
