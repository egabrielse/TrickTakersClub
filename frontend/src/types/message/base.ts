export type BaseMessage = {
    id: string;                 // Unique message id
    senderId: string;           // User id of sender
    receiverId: string;         // User id of receiver
    messageType: string;        // Type of message
    data: object | undefined;   // Message payload as raw JSON
    timestamp: string;          // ISO string for timestamp
};

export interface UnknownMessage extends BaseMessage {
    messageType: "unknown";     // Indicates an unknown message type
    data: undefined;          // No data for unknown messages
}