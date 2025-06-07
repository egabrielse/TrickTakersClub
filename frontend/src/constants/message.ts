/**
 * Types of direct messages that are sent by the server to the client.
 */
export const DIRECT_TYPES = {
    ERROR: "error",
    INITIALIZE: "initialize",
    DEAL_HAND: "deal-hand",
    PICKED_CARDS: "picked-cards",
    BURIED_CARDS: "buried-cards",
} as const;

/**
 * Types of commands that can be sent to the server.
 */
export const COMMAND_TYPES = {
    BURY: "bury",
    CALL: "call",
    GO_ALONE: "go-alone",
    END_GAME: "end-game",
    CALL_LAST_HAND: "call-last-hand",
    PASS: "pass",
    PLAY_CARD: "play-card",
    PICK: "pick",
    START_GAME: "start-game",
    SIT_DOWN: "sit-down",
    STAND_UP: "stand-up",
    UPDATE_CALLING_METHOD: "update-calling-method",
    UPDATE_NO_PICK_RESOLUTION: "update-no-pick-resolution",
    UPDATE_DOUBLE_ON_THE_BUMP: "update-double-on-the-bump",
} as const;

/**
 * Types of broadcast messages that are sent by the server to all clients.
 */
export const BROADCAST_TYPES = {
    BLIND_PICKED: "blind-picked",
    CALLED_CARD: "called-card",
    CARD_PLAYED: "card-played",
    CHAT: "chat",
    LAST_HAND: "last-hand",
    GAME_OVER: "game-over",
    GAME_STARTED: "game-started",
    GONE_ALONE: "gone-alone",
    PARTNER_REVEALED: "partner-revealed",
    SAT_DOWN: "sat-down",
    SETTINGS_UPDATED: "settings-updated",
    STOOD_UP: "stood-up",
    TIMEOUT: "timeout",
    TRICK_WON: "trick-won",
    HAND_DONE: "hand-done",
    NEW_TRICK: "new-trick",
    UP_NEXT: "up-next",
    NO_PICK_HAND: "no-pick-hand",
} as const;

export const MESSAGE_TYPES = {
    // SYSTEM MESSAGES
    TIMEOUT: "timeout",
    ERROR: "error",
    ENTER: "enter",
    LEAVE: "leave",

    // ACTION MESSAGES
    UPDATE_CALLING_METHOD: "update-calling-method",
    UPDATE_NO_PICK_RESOLUTION: "update-no-pick-resolution",
    UPDATE_DOUBLE_ON_THE_BUMP: "update-double-on-the-bump",
    START_GAME: "start-game",
    END_GAME: "end-game",
    PICK: "pick",
    PASS: "pass",
    BURY: "bury",
    CALL: "call",
    GO_ALONE: "go-alone",
    PLAY_CARD: "play-card",
    CALL_LAST_HAND: "call-last-hand",

    // EVENT MESSAGES
    WELCOME: "welcome",
    SETTINGS_UPDATED: "settings-updated",
    ENTERED: "entered",
    LEFT: "left",
    GAME_ON: "game-on",
    GAME_OVER: "game-over",
    BLIND_PICKED: "blind-picked",
    CALLED_CARD: "called-card",
    GONE_ALONE: "gone-alone",
    CARD_PLAYED: "card-played",
    PARTNER_REVEALED: "partner-revealed",
    TRICK_WON: "trick-won",
    HAND_DONE: "hand-done",
    NEW_TRICK: "new-trick",
    UP_NEXT: "up-next",
    NO_PICK_HAND: "no-pick-hand",
    DEAL_HAND: "deal-hand",
    PICKED_CARDS: "picked-cards",
    BURIED_CARDS: "buried-cards",
    LAST_HAND: "last-hand",

    // MISC MESSAGES
    CHAT: "chat",
} as const;

export const BROADCAST_RECEIVER = "*";