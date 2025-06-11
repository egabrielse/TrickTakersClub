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
