export const CALLING_METHODS = {
    ['cut-throat']: {
        ID: "cut-throat",
        LABEL: "Cut Throat",
    },
    ['jack-of-diamonds']: {
        ID: "jack-of-diamonds",
        LABEL: "Jack of Diamonds",
    },
    ['call-an-ace']: {
        ID: "call-an-ace",
        LABEL: "Call an Ace",
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

export const PLAYER_COUNT = 5;
export const HAND_SIZE = 6;
export const BLIND_SIZE = 2;

export const GAME_SETTINGS_DEFAULTS = {
    CALLING_METHODS: CALLING_METHODS["jack-of-diamonds"],
    NO_PICK_RESOLUTIONS: NO_PICK_RESOLUTIONS["screw-the-dealer"],
    DOUBLE_ON_THE_BUMP: false,
    BLITZING: false,
    CRACKING: false,
} as const;

export const HAND_PHASE = {
    PICK: 'pick',
    CALL: 'call',
    BURY: 'bury',
    PLAY: 'play',
    DONE: 'done',
} as const;