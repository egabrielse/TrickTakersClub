import axios from "axios";
import auth from "../firebase/auth";
import { UserSettingsEntity } from "../types/user";

export async function fetchUserSettings() {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get<UserSettingsEntity>(`/v1/user_settings`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}

export async function saveUserSettings(userSettings: UserSettingsEntity) {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.put(`/v1/user_settings`, userSettings, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}
