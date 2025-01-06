export const CALLING_METHOD = {
    JACK_OF_DIAMONDS: 'jack-of-diamonds',
    CALL_AN_ACE: 'call-an-ace',
} as const;

export const NO_PICK_RESOLUTION = {
    SCREW_THE_DEALER: 'screw-the-dealer',
    LEASTERS: 'leasters',
    MOSTERS: 'mosters',
    DOUBLERS: 'doublers',
} as const;

export const GAME_SETTINGS_DEFAULTS = {
    AUTO_DEAL: false,
    PLAYER_COUNT: 5,
    CALLING_METHOD: CALLING_METHOD.JACK_OF_DIAMONDS,
    NO_PICK_RESOLUTION: NO_PICK_RESOLUTION.SCREW_THE_DEALER,
    DOUBLE_ON_THE_BUMP: false,
    BLITZING: false,
    CRACKING: false,
} as const;

export const GAME_SETTINGS_PARAMS = {
    SUPPORTED_PLAYER_COUNTS: [3, 4, 5, 6, 7],
    MIN_PLAYERS: 3,
    MAX_PLAYERS: 7,
} as const;

export const HAND_PHASE = {
    PICK: 'pick',
    CALL: 'call',
    BURY: 'bury',
    PLAY: 'play',
    SCORE: 'score',
} as const;

export const MIN_GAME_WIDTH = 500;
export const MIN_GAME_HEIGHT = 500;

export const CARD_SUIT = {
    SPADE: "spade",
    HEART: "heart",
    DIAMOND: "diamond",
    CLUB: "club",
} as const;

export const CARD_RANK = {
    SEVEN: 'seven',
    EIGHT: 'eight',
    NINE: 'nine',
    KING: 'king',
    TEN: 'ten',
    ACE: 'ace',
    JACK: 'jack',
    QUEEN: 'queen',
} as const;

export const CARD_SIZE = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
} as const;


export const PLAYER_ROLE = {
    PICKER: "picker",
    PARTNER: "partner",
    OPPONENT: "opponent",
} as const;

export const DEFAULT_CARD_BACK = 1;
