import store from "../store"
import {
    setAuthenticated, setIsAuthenticating,
    setPasswordResetKey,
    setSessionError,
    setShowLoginModal,
    setUser, setUserId
} from "../reducers/session-reducer";
import { produce } from "immer";
import {
    SESSION_USER_TOKEN,
    SESSION_USER_TOKEN_EXPIRY,
} from "../constants/session-constants";
import { isSet } from "@/helpers/utils";
import { SessionService } from "@/library/services/session/SessionService";

export function setSessionUserAction(data, token, tokenExpiry, authenticated = false) {
    let sessionUserState = { ...store.getState().session.user };
    const nextState = produce(sessionUserState, (draftState) => {
        const extractedUserData = SessionService.extractUserData(data);
        Object.keys(extractedUserData).forEach((key) => {
            draftState[key] = extractedUserData[key];
        });
        draftState[SESSION_USER_TOKEN] = token;
        draftState[SESSION_USER_TOKEN_EXPIRY] = tokenExpiry;
    })
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