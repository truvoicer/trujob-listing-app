// AUTH STATE
import { createSlice } from "@reduxjs/toolkit";
import {
  SESSION_AUTH_PROVIDER,
  SESSION_AUTH_PROVIDER_USER_ID,
  SESSION_AUTHENTICATED,
  SESSION_ERROR,
  SESSION_IS_AUTHENTICATING,
  SESSION_MODAL_COMPONENT,
  SESSION_MODAL_ID,
  SESSION_MODAL_ON_CANCEL,
  SESSION_MODAL_ON_CLOSE,
  SESSION_MODAL_ON_OK,
  SESSION_MODAL_PREVENT_CLOSE,
  SESSION_MODAL_SHOW,
  SESSION_MODAL_SHOW_CLOSE_BUTTON,
  SESSION_MODAL_SHOW_FOOTER,
  SESSION_MODAL_TITLE,
  SESSION_MODALS,
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
  SESSION_USER_PROFILE_PHONE,
  SESSION_USER_ROLES,
  SESSION_USER_SETTINGS,
  SESSION_USER_SETTINGS_COUNTRY,
  SESSION_USER_SETTINGS_CURRENCY,
  SESSION_USER_SETTINGS_LANGUAGE,
  SESSION_USER_SETTINGS_PUSH_NOTIFICATION,
  SESSION_USER_SETTINGS_TIMEZONE,
  SESSION_USER_SETTINGSS_APP_THEME,
  SESSION_USER_TOKEN,
  SESSION_USER_USERNAME,
} from "../constants/session-constants";
import { Currency } from "@/types/Currency";
import { Country } from "@/types/Country";
import { Language } from "@/types/Language";
import { Address } from "@/components/blocks/Admin/User/Address/ManageAddress";

export type SessionModalComponents = "UserCurrencyForm";
export type SessionModalItem = {
  [SESSION_MODAL_ID]: string;
  [SESSION_MODAL_TITLE]?: string;
  [SESSION_MODAL_SHOW]: boolean;
  [SESSION_MODAL_SHOW_CLOSE_BUTTON]?: boolean;
  [SESSION_MODAL_SHOW_FOOTER]?: boolean;
  [SESSION_MODAL_PREVENT_CLOSE]?: boolean;
  [SESSION_MODAL_ON_OK]?: () => void;
  [SESSION_MODAL_ON_CANCEL]?: () => void;
  [SESSION_MODAL_ON_CLOSE]?: () => void;
  [SESSION_MODAL_COMPONENT]: SessionModalComponents;
};
export type SessionUserProfile = {
  [SESSION_USER_PROFILE_DOB]?: string | null;
  [SESSION_USER_PROFILE_PHONE]?: string | null;
};
export type SessionUserSettings = {
  [SESSION_USER_SETTINGS_CURRENCY]?: Currency | null;
  [SESSION_USER_SETTINGS_COUNTRY]?: Country | null;
  [SESSION_USER_SETTINGS_LANGUAGE]?: Language | null;
  [SESSION_USER_SETTINGS_TIMEZONE]?: string | null;
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
  [SESSION_USER_ADDRESSES]: Array<Address>;
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
  [SESSION_MODALS]: Array<SessionModalItem>;
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
    [SESSION_USER_SETTINGS_TIMEZONE]: null,
    [SESSION_USER_SETTINGSS_APP_THEME]: "light",
    [SESSION_USER_SETTINGS_PUSH_NOTIFICATION]: false,
  },
  [SESSION_USER_PROFILE]: {
    [SESSION_USER_PROFILE_DOB]: null,
    [SESSION_USER_PROFILE_PHONE]: null,
  },
};
const defaultState: SessionState = {
  [SESSION_USER]: sessionUserData,
  [SESSION_SHOW_LOGIN_MODAL]: false,
  [SESSION_PASSWORD_RESET_KEY]: null,
  [SESSION_AUTHENTICATED]: false,
  [SESSION_IS_AUTHENTICATING]: true,
  [SESSION_MODALS]: [],
  [SESSION_ERROR]: {
    show: false,
    message: null,
    data: {},
  },
};
const defaultReducers = {
  setUser: (state: SessionState, action: { payload: SessionUserState }) => {
    state[SESSION_USER] = action.payload;
  },
  setUserSettings: (state: SessionState, action: { payload: SessionUserSettings }) => {
    state[SESSION_USER][SESSION_USER_SETTINGS] = {
      ...state[SESSION_USER][SESSION_USER_SETTINGS],
      ...action.payload,
    };
  },
  setUserId: (state: SessionState, action: { payload: string | null }) => {
    state[SESSION_USER][SESSION_USER_ID] = action.payload;
  },
  setToken: (state: SessionState, action: { payload: string | null }) => {
    state[SESSION_USER][SESSION_USER_TOKEN] = action.payload;
  },
  setPasswordResetKey: (state: SessionState, action: { payload: string | null }) => {
    state[SESSION_PASSWORD_RESET_KEY] = action.payload;
  },
  setAuthenticated: (state: SessionState, action: { payload: boolean }) => {
    state[SESSION_AUTHENTICATED] = action.payload;
  },
  setIsAuthenticating: (state: SessionState, action: { payload: boolean }) => {
    state[SESSION_IS_AUTHENTICATING] = action.payload;
  },
  setSessionModals: (state: SessionState, action: { payload: Array<SessionModalItem> }) => {
    state[SESSION_MODALS] = action.payload;
  },
  addSessionModal: (state: SessionState, action: { payload: SessionModalItem }) => {
    console.log("Adding session modal:", action.payload);
    state[SESSION_MODALS].push(action.payload);
  },
  closeSessionModal: (state: SessionState, action: { payload: string }) => {
    state[SESSION_MODALS] = state[SESSION_MODALS].filter(
      (modal) => modal[SESSION_MODAL_ID] !== action.payload
    );
  },
  setShowLoginModal: (state: SessionState, action: { payload: boolean }) => {
    state[SESSION_SHOW_LOGIN_MODAL] = action.payload;
  },
  setSessionError: (state: SessionState, action: { payload: { show: boolean; message: string | null; data: Record<string, unknown> } }) => {
    state[SESSION_ERROR] = action.payload;
    console.log(state[SESSION_ERROR]);
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
  addSessionModal,
  setSessionModals,
  setUserId,
  setPasswordResetKey,
  setSessionError,
  closeSessionModal,
  setShowLoginModal,
} = sessionSlice.actions;
