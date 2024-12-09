import { CONNECTION_STATUS } from "../constants/ably";

export type ConnectionStatus = typeof CONNECTION_STATUS[keyof typeof CONNECTION_STATUS];