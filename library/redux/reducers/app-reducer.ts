// AUTH STATE
import { createSlice } from "@reduxjs/toolkit";
import {
    APP_CURRENT_ROUTE,
    APP_LOADED,
    APP_MODE,
    APP_REQUESTED_ROUTE,
    APP_SETTINGS,
    APP_SIDEBAR_OPEN,
    APP_STATE,
    ERROR
} from "@/library/redux/constants/app-constants";


const defaultState = {
    [APP_LOADED]: false,
    [APP_CURRENT_ROUTE]: null,
    [APP_REQUESTED_ROUTE]: null,
    [APP_SETTINGS]: {},
    [APP_MODE]: "light",
    [APP_SIDEBAR_OPEN]: false,
    [ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};
const defaultReducers = {
    setAppLoaded: (state, action) => {
        state[APP_LOADED] = action.payload;
    },
    setAppCurrentRoute: (state, action) => {
        state[APP_CURRENT_ROUTE] = action.payload;
    },
    setAppRequestedRoute: (state, action) => {
        state[APP_REQUESTED_ROUTE] = action.payload;
    },
    setAppSettings: (state, action) => {
        state[APP_SETTINGS] = action.payload;
    },
    setAppMode: (state, action) => {
        state[APP_MODE] = action.payload;
    },
    setAppSidebarOpen: (state, action) => {
        state[APP_SIDEBAR_OPEN] = action.payload;
    },
    setError: (state, action) => {
        state.error = action.payload;
        console.log(state.error)
    },
};

export const appSlice = createSlice({
    name: APP_STATE,
    initialState: defaultState,
    reducers: defaultReducers
});

export const appReducer = appSlice.reducer;
export const {
    setAppLoaded,
    setAppCurrentRoute, 
    setAppRequestedRoute,
    setAppSettings,
    setAppMode,
    setAppSidebarOpen,
    setError
} = appSlice.actions;
