// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {
    SESSION_AUTH_PROVIDER, SESSION_AUTH_PROVIDER_USER_ID,
    SESSION_AUTHENTICATED, SESSION_ERROR,
    SESSION_IS_AUTHENTICATING, SESSION_PASSWORD_RESET_KEY,
    SESSION_USER,
    SESSION_USER_EMAIL, SESSION_USER_FIRSTNAME,
    SESSION_USER_ID, SESSION_USER_LASTNAME,
    SESSION_USER_TOKEN
} from "../constants/session-constants";

const defaultState = {
    [SESSION_USER]: {
        [SESSION_AUTH_PROVIDER]: "",
        [SESSION_AUTH_PROVIDER_USER_ID]: "",
        [SESSION_USER_ID]: null,
        [SESSION_USER_EMAIL]: "",
        [SESSION_USER_FIRSTNAME]: "",
        [SESSION_USER_LASTNAME]: "",
        [SESSION_USER_TOKEN]: "",
    },
    [SESSION_PASSWORD_RESET_KEY]: "",
    [SESSION_AUTHENTICATED]: false,
    [SESSION_IS_AUTHENTICATING]: true,
    [SESSION_ERROR]: {
        show: false,
        message: "",
        data: {}
    }
};
const defaultReducers = {
    setUser: (state, action) => {
        state.user = action.payload;
    },
    setUserId: (state, action) => {
        state.user[SESSION_USER_ID] = action.payload;
    },
    setToken: (state, action) => {
        state.token = action.payload;
    },
    setPasswordResetKey: (state, action) => {
        state.passwordResetKey = action.payload;
    },
    setAuthenticated: (state, action) => {
        state.authenticated = action.payload;
    },
    setIsAuthenticating: (state, action) => {
        state[SESSION_IS_AUTHENTICATING] = action.payload;
    },
    setSessionError: (state, action) => {
        state.error = action.payload;
        console.error(state.error)
    },
};

export const sessionSlice = createSlice({
    name: "session",
    initialState: defaultState,
    reducers: defaultReducers
});

export const sessionReducer = sessionSlice.reducer;
export const {setUser, setToken, setAuthenticated, setIsAuthenticating, setUserId, setPasswordResetKey, setSessionError} = sessionSlice.actions;
