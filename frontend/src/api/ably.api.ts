import axios from "axios";
import auth from "../firebase/auth";
import * as ably from "ably";

type AblyTokenResponse = {
    tokenRequest: ably.TokenRequest;
};

export async function fetchAblyToken() {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get<AblyTokenResponse>(`/api/core/v1/ably/token`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}
