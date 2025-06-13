import { GameSettings } from "./game";

export type Session = {
    id: string; // unique ID of the session
    hostId: string; // ID of the host player
    presence: Record<string, number>; // IDs of players mapped to the last ping (timestamp in ms)
    created: string; // timestamp in milliseconds
    lastUpdated: string; // timestamp in milliseconds of the last update
    gameInProgress: boolean; // whether the game is in progress
    gameSettings: GameSettings; // settings for the game
    gameSeating: string[]; // IDs of players in the order they are seated
};