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
    SITE_TIMEZONE,
    ERROR
} from "../constants/site-constants";
import { ReduxHelpers } from "../helpers/ReduxHelpers";

export const siteStateData = {
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
    [SITE_TIMEZONE]: null,
    [SITE_MEDIA]: [],
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
        console.error(state.error)
    },
};

export const siteSlice = createSlice({
    name: SITE_STATE,
    initialState: siteStateData,
    reducers: defaultReducers
});

export const siteReducer = siteSlice.reducer;
export const { setSite, setError } = siteSlice.actions;
