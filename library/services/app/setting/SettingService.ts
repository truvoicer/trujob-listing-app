import { SETTINGS_STATE } from "@/library/redux/constants/settings-constants";
import store from "@/library/redux/store";

export class SettingService {
    static REQUIRED_FIELDS = [
        'country', 
        'currency', 
        'timezone',
    ];
    static validateSettings(): boolean {
        const settingsState = store.getState()[SETTINGS_STATE];
        console.log("Validating settings state:", settingsState);
        if (!settingsState) {
            console.error("Settings state is not available or empty.");
            return false;
        }
        const settings = settingsState;
        for (const field of SettingService.REQUIRED_FIELDS) {
            if (!settings[field] || settings[field] === '') {
                console.error(`Missing required setting: ${field}`);
                return false;
            }
        }
        return true;
    }
}