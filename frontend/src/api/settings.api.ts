import axios from "axios";
import auth from "../firebase/auth";
import { SettingsEntity } from "../types/settings";

export async function fetchSettings() {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.get<SettingsEntity>(`/api/core/v1/settings`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}

export async function saveSettings(settings: SettingsEntity) {
    if (!auth.currentUser) {
        throw new Error("User not logged in");
    } else {
        const idToken = await auth.currentUser.getIdToken();
        const response = await axios.put(`/api/core/v1/settings`, settings, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        return response.data;
    }
}
