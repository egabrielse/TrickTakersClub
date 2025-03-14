import axios from "axios";
import auth from "../firebase/auth";
import { UserInfo } from "firebase/auth";

type FetchUserResponse = {
    user: UserInfo;
};

export async function fetchUserInfoById(uid: string) {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get<FetchUserResponse>(`/api/v1/user/${uid}`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}
