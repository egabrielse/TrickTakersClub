export const getWebSocketUrl = (sessionId: string, token: string) => {
    const addr = import.meta.env.VITE_PLAY_SERVICE_ADDRESS;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${addr}/api/play/v1/connect/${sessionId}?token=${token}`;
}