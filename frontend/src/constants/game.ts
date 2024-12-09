export const CALLING_METHODS = {
    JACK_OF_DIAMONDS: 'jack-of-diamonds',
    CALL_AN_ACE: 'call-an-ace',
} as const;

export const NO_PICK_RESOLUTIONS = {
    SCREW_THE_DEALER: 'screw-the-dealer',
    LEASTERS: 'leasters',
    MOSTERS: 'mosters',
    DOUBLERS: 'doublers',
} as const;

export const GAME_SETTINGS_DEFAULTS = {
    PLAYER_COUNT: 5,
    CALLING_METHOD: CALLING_METHODS.JACK_OF_DIAMONDS,
    NO_PICK_RESOLUTION: NO_PICK_RESOLUTIONS.SCREW_THE_DEALER,
    DOUBLE_ON_THE_BUMP: false,
    BLITZING: false,
} as const;

export const GAME_SETTINGS_PARAMS = {
    SUPPORTED_PLAYER_COUNTS: [3, 4, 5, 6, 7],
    MIN_PLAYERS: 3,
    MAX_PLAYERS: 7,
}