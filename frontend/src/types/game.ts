import { CALLING_METHODS, NO_PICK_RESOLUTIONS } from "../constants/game";

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