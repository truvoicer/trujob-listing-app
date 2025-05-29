// AUTH STATE
import { createSlice } from '@reduxjs/toolkit';
import {
    PAGE_VIEW,
    PAGE_NAME,
    PAGE_TITLE,
    PAGE_CONTENT,
    PAGE_BLOCKS,
    PAGE_HAS_SIDEBAR,
    PAGE_SIDEBAR_WIDGETS,
    PAGE_SETTINGS,
    PAGE_SETTINGS_META_TITLE,
    PAGE_SETTINGS_META_DESCRIPTION,
    PAGE_SETTINGS_META_KEYWORDS,
    PAGE_SETTINGS_META_ROBOTS,
    PAGE_SETTINGS_META_CANONICAL,
    PAGE_SETTINGS_META_AUTHOR,
    PAGE_SETTINGS_META_PUBLISHER,
    PAGE_SETTINGS_META_OG_TITLE,
    PAGE_SETTINGS_META_OG_DESCRIPTION,
    PAGE_SETTINGS_META_OG_TYPE,
    PAGE_SETTINGS_META_OG_URL,
    PAGE_SETTINGS_META_OG_IMAGE,
    PAGE_SETTINGS_META_OG_SITE_NAME,
    PAGE_IS_ACTIVE,
    PAGE_IS_HOME,
    PAGE_IS_FEATURED,
    PAGE_IS_PROTECTED,
    PAGE_DELETED_AT,
    PAGE_CREATED_AT,
    PAGE_UPDATED_AT,
    ERROR,
    DATA,
    PAGE_STATE,
    PAGE_ROLES,
    PAGE_LOADED,
    PAGE_HAS_PERMISSION,
    PAGE_PERMALINK,
} from '../constants/page-constants';
import { ReduxHelpers } from '../helpers/ReduxHelpers';
import { DebugHelpers } from '@/helpers/DebugHelpers';

export const pageStateData = {
    [ERROR]: null,
    [PAGE_LOADED]: false,
    [PAGE_VIEW]: null,
    [PAGE_PERMALINK]: null,
    [PAGE_NAME]: null,
    [PAGE_TITLE]: null,
    [PAGE_CONTENT]: null,
    [PAGE_IS_ACTIVE]: true,
    [PAGE_IS_HOME]: false,
    [PAGE_IS_FEATURED]: false,
    [PAGE_IS_PROTECTED]: false,
    [PAGE_HAS_SIDEBAR]: false,
    [PAGE_SIDEBAR_WIDGETS]: [],
    [PAGE_BLOCKS]: [],
    [PAGE_ROLES]: [],
    [PAGE_HAS_PERMISSION]: false,
    [PAGE_SETTINGS]: {
        [PAGE_SETTINGS_META_TITLE]: null,
        [PAGE_SETTINGS_META_DESCRIPTION]: null,
        [PAGE_SETTINGS_META_KEYWORDS]: null,
        [PAGE_SETTINGS_META_ROBOTS]: null,
        [PAGE_SETTINGS_META_CANONICAL]: null,
        [PAGE_SETTINGS_META_AUTHOR]: null,
        [PAGE_SETTINGS_META_PUBLISHER]: null,
        [PAGE_SETTINGS_META_OG_TITLE]: null,
        [PAGE_SETTINGS_META_OG_DESCRIPTION]: null,
        [PAGE_SETTINGS_META_OG_TYPE]: null,
        [PAGE_SETTINGS_META_OG_URL]: null,
        [PAGE_SETTINGS_META_OG_IMAGE]: null,
        [PAGE_SETTINGS_META_OG_SITE_NAME]: null
    },
    [PAGE_DELETED_AT]: null,
    [PAGE_CREATED_AT]: null,
    [PAGE_UPDATED_AT]: null,


};
const defaultReducers = {
    setPage: (state, action) => {
        state = ReduxHelpers.buildValidatedObject(action.payload, pageStateData, state);
    },
    setPageIsLoaded: (state, action) => {
        state[PAGE_LOADED] = action.payload;
    },
    setPageError: (state, action) => {
        state[ERROR] = action.payload;
        console.log(state.error)
    },
};

export const pageSlice = createSlice({
    name: [PAGE_STATE],
    initialState: pageStateData,
    reducers: defaultReducers
});

export const pageReducer = pageSlice.reducer;
export const {
    setPage,
    setPageIsLoaded,
    setPageError
} = pageSlice.actions;
