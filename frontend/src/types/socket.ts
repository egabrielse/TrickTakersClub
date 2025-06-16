import { CLOSE_REASON, CONNECTION_STATUS } from "../constants/socket";

export type ConnectionStatus = typeof CONNECTION_STATUS[keyof typeof CONNECTION_STATUS];

export type CloseReason = typeof CLOSE_REASON[keyof typeof CLOSE_REASON];