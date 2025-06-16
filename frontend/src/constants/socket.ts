export const CONNECTION_STATUS = {
    CONNECTING: "connecting",
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    RECONNECTING: "reconnecting",
} as const;

export const CLOSE_REASON = {
    HANDSHAKE: "handshake",
    CONNECTION_TIMEOUT: "connection-timeout",
    SESSION_TIMEOUT: "session-timeout",
    SESSION_NOT_FOUND: "session-not-found",
    SESSION_FULL: "session-full",
} as const;