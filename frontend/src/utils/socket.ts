export const getWebSocketUrl = (sessionId: string, token: string) => {
    const host = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${host}${port}/api/play/v1/connect/${sessionId}?token=${token}`;
}