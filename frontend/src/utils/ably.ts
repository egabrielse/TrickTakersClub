export const userChannel = (tableId: string, userId: string) => {
    return `${tableId}:${userId}`;
}