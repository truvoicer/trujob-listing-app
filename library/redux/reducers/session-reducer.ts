// AUTH STATE
import {createSlice} from "@reduxjs/toolkit";
import {
    SESSION_AUTH_PROVIDER, SESSION_AUTH_PROVIDER_USER_ID,
    SESSION_AUTHENTICATED, SESSION_ERROR,
    SESSION_IS_AUTHENTICATING, SESSION_PASSWORD_RESET_KEY,
    SESSION_SHOW_LOGIN_MODAL,
    SESSION_USER,
    SESSION_USER_EMAIL, SESSION_USER_FIRSTNAME,
    SESSION_USER_ID, SESSION_USER_LASTNAME,
    SESSION_USER_ROLES,
    SESSION_USER_TOKEN,
    SESSION_USER_USERNAME
} from "../constants/session-constants";


const defaultState = {
    [SESSION_USER]: {
        [SESSION_AUTH_PROVIDER]: null,
        [SESSION_AUTH_PROVIDER_USER_ID]: null,
        [SESSION_USER_ID]: null,
        [SESSION_USER_USERNAME]: null,
        [SESSION_USER_EMAIL]: null,
        [SESSION_USER_FIRSTNAME]: null,
        [SESSION_USER_LASTNAME]: null,
        [SESSION_USER_TOKEN]: null,
        [SESSION_USER_ROLES]: []
    },
    [SESSION_SHOW_LOGIN_MODAL]: false,
    [SESSION_PASSWORD_RESET_KEY]: null,
    [SESSION_AUTHENTICATED]: false,
    [SESSION_IS_AUTHENTICATING]: true,
    [SESSION_ERROR]: {
        show: false,
        message: null,
        data: {}
    }
};
const defaultReducers = {
    setUser: (state, action) => {
        state[SESSION_USER] = action.payload;
    },
    setUserId: (state, action) => {
        state[SESSION_USER][SESSION_USER_ID] = action.payload;
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
    setShowLoginModal: (state, action) => {
        state[SESSION_SHOW_LOGIN_MODAL] = action.payload;
    },
    setSessionError: (state, action) => {
        state.error = action.payload;
        console.log(state.error)
    },
};

export const sessionSlice = createSlice({
    name: "session",
    initialState: defaultState,
    reducers: defaultReducers
});

export const sessionReducer = sessionSlice.reducer;
export const {setUser, setToken, setAuthenticated, setIsAuthenticating, setUserId, setPasswordResetKey, setSessionError, setShowLoginModal} = sessionSlice.actions;
