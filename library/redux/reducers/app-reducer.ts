// AUTH STATE
import { createSlice } from "@reduxjs/toolkit";
import {
    APP_CURRENT_ROUTE,
    APP_LOADED,
    APP_MODAL_COMPONENT,
    APP_MODAL_ID,
    APP_MODAL_SHOW,
    APP_MODALS,
    APP_MODE,
    APP_REQUESTED_ROUTE,
    APP_SETTINGS,
    APP_SIDEBAR_OPEN,
    APP_STATE,
    ERROR
} from "@/library/redux/constants/app-constants";

export type AppModalComponents = 'user-currency';
export type AppModalItem = {
    [APP_MODAL_ID]: string;
    [APP_MODAL_SHOW]: boolean;
    [APP_MODAL_COMPONENT]: AppModalComponents;
};
export type AppState = {
    [APP_LOADED]: boolean;
    [APP_CURRENT_ROUTE]: string | null;
    [APP_REQUESTED_ROUTE]: string | null;
    [APP_SETTINGS]: Record<string, unknown>;
    [APP_MODE]: "light" | "dark";
    [APP_SIDEBAR_OPEN]: boolean;
    [APP_MODALS]: Array<AppModalItem>;
    [ERROR]: {
        show: boolean;
        message: string;
        data: Record<string, unknown>;
    };
};

const defaultState: AppState = {
    [APP_LOADED]: false,
    [APP_CURRENT_ROUTE]: null,
    [APP_REQUESTED_ROUTE]: null,
    [APP_SETTINGS]: {},
    [APP_MODE]: "light",
    [APP_SIDEBAR_OPEN]: false,
    [APP_MODALS]: [],
    [ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};
const defaultReducers = {
    setAppLoaded: (state: AppState, action: { payload: boolean }) => {
        state[APP_LOADED] = action.payload;
    },
    setAppCurrentRoute: (state: AppState, action: { payload: string | null }) => {
        state[APP_CURRENT_ROUTE] = action.payload;
    },
    setAppRequestedRoute: (state: AppState, action: { payload: string | null }) => {
        state[APP_REQUESTED_ROUTE] = action.payload;
    },
    setAppSettings: (state: AppState, action: { payload: Record<string, unknown> }) => {
        state[APP_SETTINGS] = action.payload;
    },
    setAppMode: (state: AppState, action: { payload: "light" | "dark" }) => {
        state[APP_MODE] = action.payload;
    },
    setAppSidebarOpen: (state: AppState, action: { payload: boolean }) => {
        state[APP_SIDEBAR_OPEN] = action.payload;
    },
    setError: (state: AppState, action: { payload: { show: boolean; message: string; data: Record<string, unknown> } }) => {
        state[ERROR] = action.payload;
        console.log(state[ERROR])
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
    setAppModals,
    addAppModal,
    setError
} = appSlice.actions;
