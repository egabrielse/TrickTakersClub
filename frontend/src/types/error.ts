
export class DeviceNotSupportedError extends Error {
    name = "Device Not Supported";

    constructor(m: string) {
        super(m);
    }
}