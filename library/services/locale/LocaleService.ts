import { SESSION_STATE, SESSION_USER, SESSION_USER_SETTINGS, SESSION_USER_SETTINGS_CURRENCY } from "@/library/redux/constants/session-constants";
import { SITE_SETTINGS, SITE_SETTINGS_CURRENCY, SITE_STATE } from "@/library/redux/constants/site-constants";
import store from "@/library/redux/store";

export class LocaleService {

    static getCurrency() {
        const sessionState = store.getState()[SESSION_STATE];
        const siteState = store.getState()[SITE_STATE];
        if (sessionState?.[SESSION_USER]?.[SESSION_USER_SETTINGS]?.[SESSION_USER_SETTINGS_CURRENCY]) {
            return sessionState[SESSION_USER][SESSION_USER_SETTINGS][SESSION_USER_SETTINGS_CURRENCY];
        }
        if (siteState?.[SITE_SETTINGS]?.[SITE_SETTINGS_CURRENCY]) {
            return siteState[SITE_SETTINGS][SITE_SETTINGS_CURRENCY];
        }
        return null;
    }
}