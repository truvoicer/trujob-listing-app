// AUTH STATE
import { createSlice } from "@reduxjs/toolkit";
import {
    SETTINGS_STATE,
    ERROR,
    SETTINGS_TIMEZONE
} from "@/library/redux/constants/settings-constants";
import { ReduxHelpers } from "../helpers/ReduxHelpers";

export type SettingsState = {
    [SETTINGS_TIMEZONE]: string | null;
    [ERROR]: {
        show: boolean;
        message: string;
        data: Record<string, unknown>;
    };
};

export const settingsStateData: SettingsState = {
    [SETTINGS_TIMEZONE]: null,
    [ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};
const defaultReducers = {
    setSettings: (state, action) => {
        state = ReduxHelpers.buildValidatedObject(action.payload, settingsStateData, state);
    },
    setError: (state, action) => {
        state.error = action.payload;
        console.log(state.error)
    },
};

export const settingsSlice = createSlice({
    name: SETTINGS_STATE,
    initialState: settingsStateData,
    reducers: defaultReducers
});

export const settingsReducer = settingsSlice.reducer;
export const { setSettings, setError } = settingsSlice.actions;
