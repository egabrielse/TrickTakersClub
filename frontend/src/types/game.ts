import { CALLING_METHODS, CARD_SIZE, CARD_SUIT, CARD_RANK, HAND_PHASE, NO_PICK_RESOLUTIONS } from "../constants/game";

export type CallingMethod = typeof CALLING_METHODS[keyof typeof CALLING_METHODS];

export type NoPickResolution = typeof NO_PICK_RESOLUTIONS[keyof typeof NO_PICK_RESOLUTIONS];

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

export type Trick = {
    upNextIndex: number;
    takerIndex: number;
    turnOrder: string[];
    cards: PlayingCard[];
}


export type CardSize = typeof CARD_SIZE[keyof typeof CARD_SIZE];

export type CardRank = typeof CARD_RANK[keyof typeof CARD_RANK];
export type CardSuit = typeof CARD_SUIT[keyof typeof CARD_SUIT];
