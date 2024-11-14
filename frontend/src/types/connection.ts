import { CONNECTION_STATUS } from "../constants/connection";

export type ConnectionStatus = (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];