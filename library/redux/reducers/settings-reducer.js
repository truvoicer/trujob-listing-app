// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {
    SETTINGS_STATE,
    SETTINGS_SITE_NAME,
    SETTINGS_SITE_DESCRIPTION,
    SETTINGS_SITE_LOGO,
    SETTINGS_SITE_KEYWORDS,
    SETTINGS_SITE_AUTHOR,
    ERROR
} from "@/library/redux/constants/settings-constants";

export const settingsStateData = {
    [SETTINGS_STATE]: null,
    [SETTINGS_SITE_NAME]: null,
    [SETTINGS_SITE_DESCRIPTION]: null,
    [SETTINGS_SITE_LOGO]: null,
    [SETTINGS_SITE_KEYWORDS]: null,
    [SETTINGS_SITE_AUTHOR]: null,
    [ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};
const defaultReducers = {
    setSettings: (state, action) => {
        state = action.payload;
    },
    setError: (state, action) => {
        state.error = action.payload;
        console.error(state.error)
    },
};

export const settingsSlice = createSlice({
    name: SETTINGS_STATE,
    initialState: settingsStateData,
    reducers: defaultReducers
});

export const settingsReducer = settingsSlice.reducer;
export const {setSettings, setError} = settingsSlice.actions;
