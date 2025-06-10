
export const BROADCAST_RECEIVER = "*";

export const SESSION_WORKER_ID = "session-worker";

export const COMMAND_TYPES = {
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
} as const;

export const EVENT_TYPES = {
    TIMEOUT: "timeout",
    ERROR: "error",
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
} as const;

export const MISC_TYPES = {
    CHAT: "chat",
} as const;
