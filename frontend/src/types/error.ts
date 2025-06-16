import { ReactNode } from "react";

export type ErrorPageAction = {
    icon?: ReactNode;
    label: string;
    onClick: () => void;
};

export class ErrorPageError extends Error {
    constructor(name: string, message?: string) {
        super(message || "An unexpected error occurred.");
        this.name = name || "Error";
    }
}

export class DeviceNotSupportedError extends ErrorPageError {
    constructor() {
        super("Device Not Supported", "Trick Takers Club is not yet supported on mobile devices. Please use a desktop browser.");
    }
}

export class ConnectionTimeoutError extends ErrorPageError {
    constructor() {
        super("Connection Timeout", "The connection to the server timed out. Please try again later.");
    }
}

export class SessionTimeoutError extends ErrorPageError {
    constructor() {
        super("Session Timeout", "The session has timed out due to inactivity. Please refresh the page to continue.");
    }
}

export class SessionNotFoundError extends ErrorPageError {
    constructor() {
        super("Session Not Found", "The session you are trying to access does not exist or has been deleted.");
    }
}

export class SessionFullError extends ErrorPageError {
    constructor() {
        super("Session Full", "The session is full and cannot accept new players. Please try joining a different session.");
    }
}