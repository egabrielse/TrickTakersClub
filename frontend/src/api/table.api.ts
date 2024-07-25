import axios from "axios";
import auth from "../firebase/auth";

type CreateTableResponse = {
    id: string;
};

export async function createTable() {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.post<CreateTableResponse>(`/v1/table`, null, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}
