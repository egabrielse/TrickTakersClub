export const CALLING_METHODS = {
    ['cut-throat']: {
        ID: "cut-throat",
        LABEL: "Call an Ace",
    },
    ['jack-of-diamonds']: {
        ID: "jack-of-diamonds",
        LABEL: "Jack of Diamonds",
    },
    ['call-an-ace']: {
        ID: "call-an-ace",
        LABEL: "Cut Throat",
    },
} as const;

export const NO_PICK_RESOLUTIONS = {
    ['screw-the-dealer']: {
        ID: "screw-the-dealer",
        LABEL: "Screw the Dealer",
    },
    ['leasters']: {
        ID: "leasters",
        LABEL: "Leasters",
    },
    ['mosters']: {
        ID: "mosters",
        LABEL: "Mosters",
    },
} as const;

export const GAME_SETTINGS_DEFAULTS = {
    AUTO_DEAL: false,
    PLAYER_COUNT: 5,
    CALLING_METHODS: CALLING_METHODS["jack-of-diamonds"],
    NO_PICK_RESOLUTIONS: NO_PICK_RESOLUTIONS["screw-the-dealer"],
    DOUBLE_ON_THE_BUMP: false,
    BLITZING: false,
    CRACKING: false,
} as const;

export const GAME_SETTINGS_PARAMS = {
    SUPPORTED_PLAYER_COUNTS: [3, 4, 5],
    MIN_PLAYERS: 3,
    MAX_PLAYERS: 5,
} as const;

export const HAND_PHASE = {
    SETUP: 'setup',
    PICK: 'pick',
    CALL: 'call',
    BURY: 'bury',
    PLAY: 'play',
    SCORE: 'score',
} as const;

export const MIN_GAME_WIDTH = 500;
export const MIN_GAME_HEIGHT = 500;



export const PLAYER_ROLE = {
    PICKER: "picker",
    PARTNER: "partner",
    OPPONENT: "opponent",
} as const;

