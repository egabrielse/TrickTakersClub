import { GameSettings } from "./game";

export type Session = {
    id: string; // unique ID of the session
    hostId: string; // ID of the host player
    presence: Record<string, number>; // IDs of players mapped to the last ping (timestamp in ms)
    created: number; // timestamp in milliseconds
    gameSettings: GameSettings; // game settings used to create a new game
};