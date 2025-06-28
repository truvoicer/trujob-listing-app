// AUTH STATE
import { createSlice } from "@reduxjs/toolkit";
import {
  SESSION_AUTH_PROVIDER,
  SESSION_AUTH_PROVIDER_USER_ID,
  SESSION_AUTHENTICATED,
  SESSION_ERROR,
  SESSION_IS_AUTHENTICATING,
  SESSION_PASSWORD_RESET_KEY,
  SESSION_SHOW_LOGIN_MODAL,
  SESSION_USER,
  SESSION_USER_ADDRESSES,
  SESSION_USER_EMAIL,
  SESSION_USER_FIRSTNAME,
  SESSION_USER_ID,
  SESSION_USER_LASTNAME,
  SESSION_USER_PROFILE,
  SESSION_USER_PROFILE_DOB,
  SESSION_USER_ROLES,
  SESSION_USER_SETTINGS,
  SESSION_USER_SETTINGS_COUNTRY,
  SESSION_USER_SETTINGS_CURRENCY,
  SESSION_USER_SETTINGS_LANGUAGE,
  SESSION_USER_SETTINGS_PUSH_NOTIFICATION,
  SESSION_USER_SETTINGSS_APP_THEME,
  SESSION_USER_TOKEN,
  SESSION_USER_USERNAME,
} from "../constants/session-constants";
import { Currency } from "@/types/Currency";
import { Country } from "@/types/Country";
import { Language } from "@/types/Language";

export type SessionUserProfile = {
  [SESSION_USER_PROFILE_DOB]?: string | null;
};
export type SessionUserSettings = {
  [SESSION_USER_SETTINGS_CURRENCY]?: Currency | null;
  [SESSION_USER_SETTINGS_COUNTRY]?: Country | null;
  [SESSION_USER_SETTINGS_LANGUAGE]?: Language | null;
  [SESSION_USER_SETTINGSS_APP_THEME]?: string;
  [SESSION_USER_SETTINGS_PUSH_NOTIFICATION]?: boolean;
};
export type SessionUserState = {
  [SESSION_AUTH_PROVIDER]: string | null;
  [SESSION_AUTH_PROVIDER_USER_ID]: string | null;
  [SESSION_USER_ID]: string | null;
  [SESSION_USER_USERNAME]: string | null;
  [SESSION_USER_EMAIL]: string | null;
  [SESSION_USER_FIRSTNAME]: string | null;
  [SESSION_USER_LASTNAME]: string | null;
  [SESSION_USER_ADDRESSES]: Array<unknown>;
  [SESSION_USER_TOKEN]: string | null;
  [SESSION_USER_ROLES]: Array<string>;
  [SESSION_USER_PROFILE]: SessionUserProfile;
  [SESSION_USER_SETTINGS]?: SessionUserSettings;
};
export type SessionState = {
  [SESSION_USER]: SessionUserState;
  [SESSION_SHOW_LOGIN_MODAL]: boolean;
  [SESSION_PASSWORD_RESET_KEY]: string | null;
  [SESSION_AUTHENTICATED]: boolean;
  [SESSION_IS_AUTHENTICATING]: boolean;
  [SESSION_ERROR]: {
    show: boolean;
    message: string | null;
    data: Record<string, unknown>;
  };
};

export const sessionUserData: SessionUserState = {
  [SESSION_AUTH_PROVIDER]: null,
  [SESSION_AUTH_PROVIDER_USER_ID]: null,
  [SESSION_USER_ID]: null,
  [SESSION_USER_USERNAME]: null,
  [SESSION_USER_EMAIL]: null,
  [SESSION_USER_FIRSTNAME]: null,
  [SESSION_USER_LASTNAME]: null,
  [SESSION_USER_ADDRESSES]: [],
  [SESSION_USER_TOKEN]: null,
  [SESSION_USER_ROLES]: [],
  [SESSION_USER_SETTINGS]: {
    [SESSION_USER_SETTINGS_COUNTRY]: null,
    [SESSION_USER_SETTINGS_LANGUAGE]: null,
    [SESSION_USER_SETTINGS_CURRENCY]: null,
    [SESSION_USER_SETTINGSS_APP_THEME]: "light",
    [SESSION_USER_SETTINGS_PUSH_NOTIFICATION]: false,
  },
  [SESSION_USER_PROFILE]: {
    [SESSION_USER_PROFILE_DOB]: null,
  },
};
const defaultState: SessionState = {
  [SESSION_USER]: sessionUserData,
  [SESSION_SHOW_LOGIN_MODAL]: false,
  [SESSION_PASSWORD_RESET_KEY]: null,
  [SESSION_AUTHENTICATED]: false,
  [SESSION_IS_AUTHENTICATING]: true,
  [SESSION_ERROR]: {
    show: false,
    message: null,
    data: {},
  },
};
const defaultReducers = {
  setUser: (state, action) => {
    state[SESSION_USER] = action.payload;
  },
  setUserSettings: (state, action) => {
    state[SESSION_USER][SESSION_USER_SETTINGS] = {
      ...state[SESSION_USER][SESSION_USER_SETTINGS],
      ...action.payload,
    };
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
    console.log(state.error);
  },
};

export const sessionSlice = createSlice({
  name: "session",
  initialState: defaultState,
  reducers: defaultReducers,
});

export const sessionReducer = sessionSlice.reducer;
export const {
  setUser,
  setUserSettings,
  setToken,
  setAuthenticated,
  setIsAuthenticating,
  setUserId,
  setPasswordResetKey,
  setSessionError,
  setShowLoginModal,
} = sessionSlice.actions;
