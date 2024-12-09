export const MESSAGE_TYPES = {
    CHAT: "chat",
    TIMEOUT: "timeout",
    STATE: "state",
    UPDATE_SETTINGS: "update-settings",
} as const;

export const CONNECTION_STATUS = {
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    CONNECTING: "connecting",
} as const;