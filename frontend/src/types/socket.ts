import { CONNECTION_STATUS } from "../constants/socket";

export type ConnectionStatus = typeof CONNECTION_STATUS[keyof typeof CONNECTION_STATUS];
