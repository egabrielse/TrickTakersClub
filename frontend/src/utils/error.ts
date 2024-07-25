import { AuthErrorCodes } from "firebase/auth";
import { ERROR_MESSAGES } from "../constants/error";
import { SerializedError } from "@reduxjs/toolkit";

export const getErrorForDisplay = (error: SerializedError) => {
    if (error?.name === "FirebaseError") {
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
            return ERROR_MESSAGES.ALREADY_EXISTS;
        } else if (error.code === AuthErrorCodes.USER_DELETED) {
            return ERROR_MESSAGES.INVALID_CREDENTIALS;
        } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
            return ERROR_MESSAGES.INVALID_CREDENTIALS;
        } else {
            return ERROR_MESSAGES.DEFAULT;
        }
    } else {
        return ERROR_MESSAGES.DEFAULT;
    }
};
