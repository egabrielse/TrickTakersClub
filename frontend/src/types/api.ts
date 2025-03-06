import { ASYNC_STATUS } from "../constants/api";

export type AsyncStatus = typeof ASYNC_STATUS[keyof typeof ASYNC_STATUS];