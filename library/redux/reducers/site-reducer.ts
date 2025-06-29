// AUTH STATE
import { createSlice } from "@reduxjs/toolkit";
import {
    SITE_MEDIA,
    SITE_STATE,
    SITE_NAME,
    SITE_TITLE,
    SITE_DESCRIPTION,
    SITE_SEO_TITLE,
    SITE_SEO_DESCRIPTION,
    SITE_SEO_KEYWORDS,
    SITE_AUTHOR,
    SITE_LOGO,
    SITE_FAVICON,
    SITE_ADDRESS,
    SITE_PHONE,
    SITE_EMAIL,
    SITE_GOOGLE_LOGIN_CLIENT_ID,
    SITE_GOOGLE_TAG_MANAGER_ID,
    SITE_HUBSPOT_ACCESS_TOKEN,
    SITE_FACEBOOK_APP_ID,
    SITE_FACEBOOK_APP_SECRET,
    SITE_FACEBOOK_GRAPH_VERSION,
    SITE_FACEBOOK_FOLLOW_URL,
    SITE_INSTAGRAM_FOLLOW_URL,
    SITE_TIKTOK_FOLLOW_URL,
    SITE_PINTEREST_FOLLOW_URL,
    SITE_X_FOLLOW_URL,
    ERROR,
    SITE_SETTINGS,
    SITE_ID,
    SITE_SETTINGS_CURRENCY,
    SITE_SETTINGS_COUNTRY,
    SITE_SETTINGS_TIMEZONE,
    SITE_SETTINGS_LANGUAGE,
    SITE_SETTINGS_FRONTEND_URL
} from "../constants/site-constants";
import { ReduxHelpers } from "../helpers/ReduxHelpers";
import { Country } from "@/types/Country";
import { Currency } from "@/types/Currency";
import { Language } from "@/types/Language";

export type SiteSettingState = {
    [SITE_SETTINGS_COUNTRY]: Country | null;
    [SITE_SETTINGS_CURRENCY]: Currency | null;
    [SITE_SETTINGS_LANGUAGE]: Language | null;
    [SITE_SETTINGS_TIMEZONE]: string | null;
    [SITE_SETTINGS_FRONTEND_URL]: string | null;
};
export type SiteState = {
    [SITE_ID]: string | null;
    [SITE_NAME]: string | null;
    [SITE_TITLE]: string | null;
    [SITE_DESCRIPTION]: string | null;
    [SITE_SEO_TITLE]: string | null;
    [SITE_SEO_DESCRIPTION]: string | null;
    [SITE_SEO_KEYWORDS]: string | null;
    [SITE_AUTHOR]: string | null;
    [SITE_LOGO]: string | null;
    [SITE_FAVICON]: string | null;
    [SITE_ADDRESS]: string | null;
    [SITE_PHONE]: string | null;
    [SITE_EMAIL]: string | null;
    [SITE_GOOGLE_LOGIN_CLIENT_ID]: string | null;
    [SITE_GOOGLE_TAG_MANAGER_ID]: string | null;
    [SITE_HUBSPOT_ACCESS_TOKEN]: string | null;
    [SITE_FACEBOOK_APP_ID]: string | null;
    [SITE_FACEBOOK_APP_SECRET]: string | null;
    [SITE_FACEBOOK_GRAPH_VERSION]: string | null;
    [SITE_FACEBOOK_FOLLOW_URL]: string | null;
    [SITE_INSTAGRAM_FOLLOW_URL]: string | null;
    [SITE_TIKTOK_FOLLOW_URL]: string | null;
    [SITE_PINTEREST_FOLLOW_URL]: string | null;
    [SITE_X_FOLLOW_URL]: string | null;
    [SITE_MEDIA]: Array<unknown>;
    [SITE_SETTINGS]: Record<string, unknown>;
    [ERROR]: {
        show: boolean;
        message: string;
        data: Record<string, unknown>;
    };
};

export const siteStateData: SiteState = {
    [SITE_ID]: null,
    [SITE_NAME]: null,
    [SITE_TITLE]: null,
    [SITE_DESCRIPTION]: null,
    [SITE_SEO_TITLE]: null,
    [SITE_SEO_DESCRIPTION]: null,
    [SITE_SEO_KEYWORDS]: null,
    [SITE_AUTHOR]: null,
    [SITE_LOGO]: null,
    [SITE_FAVICON]: null,
    [SITE_ADDRESS]: null,
    [SITE_PHONE]: null,
    [SITE_EMAIL]: null,
    [SITE_GOOGLE_LOGIN_CLIENT_ID]: null,
    [SITE_GOOGLE_TAG_MANAGER_ID]: null,
    [SITE_HUBSPOT_ACCESS_TOKEN]: null,
    [SITE_FACEBOOK_APP_ID]: null,
    [SITE_FACEBOOK_APP_SECRET]: null,
    [SITE_FACEBOOK_GRAPH_VERSION]: null,
    [SITE_FACEBOOK_FOLLOW_URL]: null,
    [SITE_INSTAGRAM_FOLLOW_URL]: null,
    [SITE_TIKTOK_FOLLOW_URL]: null,
    [SITE_PINTEREST_FOLLOW_URL]: null,
    [SITE_X_FOLLOW_URL]: null,
    [SITE_MEDIA]: [],
    [SITE_SETTINGS]: {
        [SITE_SETTINGS_COUNTRY]: {
            id: null,
            name: null,
            iso2: null,
            iso3: null,
            phone_code: null,
            created_at: null,
            updated_at: null,
        },
        [SITE_SETTINGS_CURRENCY]: {
            id: null,
            name: null,
            name_plural: null,
            code: null,
            symbol: null,
            created_at: null,
            updated_at: null,
            country: {
                id: null,
                name: null,
                code: null,
                symbol: null,
                created_at: null,
                updated_at: null,
            },
        },
        [SITE_SETTINGS_LANGUAGE]: {
            id: null,
            name: null,
            iso639_1: null,
            iso639_2: null,
            created_at: null,
            updated_at: null,
        },
        [SITE_SETTINGS_TIMEZONE]: null,
        [SITE_SETTINGS_FRONTEND_URL]: null,
    },
    [ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};
const defaultReducers = {
    setSite: (state, action) => {
        state = ReduxHelpers.buildValidatedObject(action.payload, siteStateData, state);
    },
    setError: (state, action) => {
        state.error = action.payload;
        console.log(state.error)
    },
};

export const siteSlice = createSlice({
    name: SITE_STATE,
    initialState: siteStateData,
    reducers: defaultReducers
});

export const siteReducer = siteSlice.reducer;
export const { setSite, setError } = siteSlice.actions;
