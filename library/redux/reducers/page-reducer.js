// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {
    PAGE_DATA,
    PAGE_SEARCH_PARAMS,
    PAGE_SETTINGS,
    PAGE_STATUS,
    PAGE_STATUS_IDLE
} from "@/library/redux/constants/page-constants";

const defaultState = {
    [PAGE_STATUS]: PAGE_STATUS_IDLE,
    [PAGE_SEARCH_PARAMS]: {
        page: null,
        sort_by: null,
        sort_order: null,
        page_size: null,
        query: null,
    },
    [PAGE_DATA]: {},
    [PAGE_SETTINGS]: {},
    error: {}
};
const defaultReducers = {
    setPageStatus: (state, action) => {
        state[PAGE_STATUS] = action.payload;
    },
    setPageData: (state, action) => {
        state[PAGE_SEARCH_PARAMS] = action.payload;
    },
    setPageSettings: (state, action) => {
        state[PAGE_SETTINGS] = action.payload;
    },
    setSearchParamPage: (state, action) => {
        state.searchParams.page = action.payload;
    },
    setSearchParamSortOrder: (state, action) => {
        state.searchParams.sort_order = action.payload;
    },
    setSearchParamSortBy: (state, action) => {
        state.searchParams.sort_by = action.payload;
    },
    setSearchParamQuery: (state, action) => {
        state.searchParams.query = action.payload;
    },
    setSearchParamPageSize: (state, action) => {
        state.searchParams.page_size = action.payload;
    },
    setPageError: (state, action) => {
        state.error = action.payload;
        console.error(state.error)
    },
};

export const pageSlice = createSlice({
    name: "page",
    initialState: defaultState,
    reducers: defaultReducers
});

export const pageReducer = pageSlice.reducer;
export const {
    setPageStatus,
    setPageData,
    setPageSettings,
    setSearchParamPage,
    setSearchParamSortOrder,
    setSearchParamSortBy,
    setSearchParamQuery,
    setSearchParamPageSize,
    setPageError
} = pageSlice.actions;
