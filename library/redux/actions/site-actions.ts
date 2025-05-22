import store from "../store"
import {
    setError,
    setSite,
} from "../reducers/site-reducer";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { SITE_NAME, SITE_SETTINGS, SITE_SETTINGS_COUNTRY, SITE_SETTINGS_CURRENCY, SITE_STATE } from "../constants/site-constants";

export function getSiteNameAction(name: string) {
    return store.getState()[SITE_STATE]?.[SITE_NAME];
}
export function getSiteStateAction() {
    return store.getState()[SITE_STATE];
}
export function getSiteCurrencyAction() {
    return store.getState()[SITE_STATE]?.[SITE_SETTINGS]?.[SITE_SETTINGS_CURRENCY];
}
export function getSiteCountryAction() {
    return store.getState()[SITE_STATE]?.[SITE_SETTINGS]?.[SITE_SETTINGS_COUNTRY];
}
export function setSiteErrorAction(error: Record<string, any>) {
    store.dispatch(setError(error));
}
export function setSiteAction(data: Record<string, any>) {
    store.dispatch(setSite(data));
}

export async function refreshSiteAction() {
    const siteState = store.getState()[SITE_STATE];
    if (!siteState?.[SITE_NAME]) {
        throw new Error("Site name is not defined");
    }
    const truJobApiMiddleware = new TruJobApiMiddleware();
    const site = await truJobApiMiddleware.resourceRequest({
        endpoint: `${truJobApiConfig.endpoints.site}/${siteState[SITE_NAME]}`,
        method: ApiMiddleware.METHOD.GET,
    });
    if (!site?.data) {
        throw new Error("Failed to fetch site data");
    }
    store.dispatch(setSite(site.data));
}