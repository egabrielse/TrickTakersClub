import axios from "axios";
import auth from "../firebase/auth";

type HealthCheckResponse = {
    redis: boolean;
    firebaseAuth: boolean;
};

export async function healthCheck() {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get<HealthCheckResponse>(`/v1`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}
