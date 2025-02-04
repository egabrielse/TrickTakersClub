export const CALLING_METHODS = {
    CUT_THROAT: 'cut-throat',
    JACK_OF_DIAMONDS: 'jack-of-diamonds',
    CALL_AN_ACE: 'call-an-ace',
} as const;

export const NO_PICK_RESOLUTIONS = {
    SCREW_THE_DEALER: 'screw-the-dealer',
    LEASTERS: 'leasters',
    MOSTERS: 'mosters',
} as const;

export const GAME_SETTINGS_DEFAULTS = {
    AUTO_DEAL: false,
    PLAYER_COUNT: 5,
    CALLING_METHODS: CALLING_METHODS.JACK_OF_DIAMONDS,
    NO_PICK_RESOLUTIONS: NO_PICK_RESOLUTIONS.SCREW_THE_DEALER,
    DOUBLE_ON_THE_BUMP: false,
    BLITZING: false,
    CRACKING: false,
} as const;

export const GAME_SETTINGS_PARAMS = {
    SUPPORTED_PLAYER_COUNTS: [3, 4, 5, 6, 7],
    MIN_PLAYERS: 3,
    MAX_PLAYERS: 6,
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

