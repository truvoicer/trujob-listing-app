import store from "../store"
import {
    addSessionModal,
    closeSessionModal,
    SessionModalItem,
    SessionUserSettings,
    SessionUserState,
    setAuthenticated, setIsAuthenticating,
    setPasswordResetKey,
    setSessionError,
    setSessionModals,
    setShowLoginModal,
    setUser, setUserId,
    setUserSettings
} from "../reducers/session-reducer";
import { produce } from "immer";
import {
    SESSION_STATE,
    SESSION_USER,
    SESSION_USER_TOKEN,
    SESSION_USER_TOKEN_EXPIRY,
} from "../constants/session-constants";
import { isSet } from "@/helpers/utils";

export function setSessionUserAction(
    data: SessionUserState, 
    token?: string, 
    tokenExpiry?: number, 
    authenticated: boolean = false
) {
    const sessionUserState: SessionUserState = { ...store.getState()[SESSION_STATE][SESSION_USER] };
    const nextState = produce(sessionUserState, (draftState) => {
        const extractedUserData = data;
        Object.keys(data).forEach((key) => {
            draftState[key] = extractedUserData[key];
        });
        draftState[SESSION_USER_TOKEN] = token;
        draftState[SESSION_USER_TOKEN_EXPIRY] = tokenExpiry;
    });
    
    store.dispatch(setUser(nextState))
    store.dispatch(setAuthenticated(authenticated))
}

export function resetSessionErrorAction() {
    let sessionErrorState = { ...store.getState().session.error };
    const nextState = produce(sessionErrorState, (draftState) => {
        draftState.show = false;
        draftState.message = "";
        draftState.data = {};
    });
    store.dispatch(setSessionError(nextState))
}

export function setSessionErrorAction(error) {
    let sessionErrorState = { ...store.getState().session.error };
    const nextState = produce(sessionErrorState, (draftState) => {
        draftState.show = true;
        if (isSet(error.response) && isSet(error.response.data) && isSet(error.response.data.message)) {
            draftState.message = error.response.data.message;
        } else {
            draftState.message = "Session Error";
        }
    });
    store.dispatch(setSessionError(nextState))
}


export function getSessionUserAction() {
    return { ...store.getState().session.user };
}

export function getSessionAction() {
    return { ...store.getState().session };
}

export function setSessionUserSettingsAction(settings: SessionUserSettings) {
    store.dispatch(setUserSettings(settings));
}
export function setSessionUserIdAction(userId: number) {
    store.dispatch(setUserId(userId));
}

export function setPasswordResetKeyAction(passwordResetKey: string) {
    store.dispatch(setPasswordResetKey(passwordResetKey));
}

export function setAuthenticatedAction(isAuthenticated: boolean) {
    store.dispatch(setAuthenticated(isAuthenticated));
}
export function setIsAuthenticatingAction(isAuthenticating: boolean) {
    store.dispatch(setIsAuthenticating(isAuthenticating));
}
export function setShowLoginModalAction(showLoginModal: boolean) {
    store.dispatch(setShowLoginModal(showLoginModal));
}

export function setSessionModalsAction(modalItems: Array<SessionModalItem>) {
    store.dispatch(setSessionModals(modalItems))
}

export function addSessionModalAction(modalItem: SessionModalItem) {
    store.dispatch(addSessionModal(modalItem))
}

export function closeSessionModalAction(modalId: string) {
    store.dispatch(closeSessionModal(modalId))
}