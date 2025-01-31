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
    takerId: string;
    turnOrder: string[];
    cards: Record<string, PlayingCard>;
}

export function newTrick(): Trick {
    return {
        turnOrder: [],
        takerId: "",
        cards: {},
    };
}

export type CardSize = typeof CARD_SIZE[keyof typeof CARD_SIZE];

export type CardRank = typeof CARD_RANK[keyof typeof CARD_RANK];
export type CardSuit = typeof CARD_SUIT[keyof typeof CARD_SUIT];
