import axios from "axios";
import auth from "../firebase/auth";
import { Session } from "../types/session";

type CreateSessionResponse = {
    sessionId: string;
};

export async function createSession() {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.post<CreateSessionResponse>(`/api/play/v1/session`, null, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}

type ReviveGameResponse = {
    sessionId: string;
};

export async function reviveGame(gameId: string) {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.post<ReviveGameResponse>(`/api/play/v1/session/${gameId}`, null, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}

type FetchSessionListResponse = Session[]

export async function fetchSessionList() {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get<FetchSessionListResponse>(`/api/core/v1/session`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}