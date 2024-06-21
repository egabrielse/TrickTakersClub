import { Middleware } from "redux";
import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger({
    diff: true,
    collapsed: true,
}) as Middleware;
  

export default loggerMiddleware;