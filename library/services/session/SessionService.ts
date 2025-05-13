import { DebugHelpers } from "@/helpers/DebugHelpers";
import { isSet } from "@/helpers/utils";
import { setIsAuthenticatingAction, setSessionUserAction } from "@/library/redux/actions/session-actions";
import { SESSION_AUTH_PROVIDER, SESSION_AUTH_PROVIDER_USER_ID, SESSION_STATE, SESSION_USER, SESSION_USER_EMAIL, SESSION_USER_FIRSTNAME, SESSION_USER_ID, SESSION_USER_LASTNAME, SESSION_USER_ROLES, SESSION_USER_USERNAME } from "@/library/redux/constants/session-constants";
import store from "@/library/redux/store";

export class SessionService {

    static USER_FIELDS = [
        SESSION_AUTH_PROVIDER,
        SESSION_AUTH_PROVIDER_USER_ID,
        SESSION_USER_ID,
        SESSION_USER_EMAIL,
        SESSION_USER_USERNAME,
        SESSION_USER_FIRSTNAME,
        SESSION_USER_LASTNAME,
        SESSION_USER_ROLES,
    ];
    static initUserData() {
        let userData = {};
        SessionService.USER_FIELDS.forEach((field) => {
            userData[field] = null;
        });
        return userData;
    }
    static extractUserData(data) {
        if (typeof data !== "object") {
            return {};
        }
        let userData = {};
        SessionService.USER_FIELDS.forEach((field) => {
            if (!data.hasOwnProperty(field)) {
                return;
            }
            userData[field] = data[field];
        });
        return userData;
    }

    static async handleTokenResponse(token, tokenExpiry, user) {
        if (!token) {
            DebugHelpers.log(DebugHelpers.ERROR, 'Token not found');
            DebugHelpers.log(DebugHelpers.DEBUG, {
                message: 'Token not found',
                token: token,
                tokenExpiry: tokenExpiry,
                user: user
            });
            setIsAuthenticatingAction(false)
            return false;
        }
        if (!user) {
            DebugHelpers.log(DebugHelpers.ERROR, 'User not found');
            setIsAuthenticatingAction(false)
            return false;
        }
        SessionService.setSessionLocalStorage(token, tokenExpiry);
        setSessionUserAction(SessionService.extractUserData(user), token, tokenExpiry, true);
        setIsAuthenticatingAction(false)
        return true;
    }

    static logout() {
        setSessionUserAction(
            SessionService.initUserData(),
            null,
            null,
            false
        );
        SessionService.removeLocalSession();
    }
    
    static setSessionLocalStorage(token, expiresAt) {
        localStorage.setItem('token', token);
        localStorage.setItem('expires_at', expiresAt);
    }
    
    // removes user details from localStorage
    static removeLocalSession()  {
        // Clear access token and ID token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('expires_at');
    }
    
    static getSessionObject() {
        if (typeof localStorage === 'undefined') {
            return false;
        }
        try {
            let expiresAt = localStorage.getItem('expires_at');
            let token = localStorage.getItem('token');
            if (!isSet(expiresAt) || expiresAt === null || expiresAt === "" ||
                !isSet(token) || token === null || token === "") {
                return false;
            }
            const expiry = JSON.parse(expiresAt);
            return {
                token: localStorage.getItem('token'),
                expires_at: expiry
            }
        } catch (error) {
            DebugHelpers.log(DebugHelpers.ERROR, error);
            SessionService.logout();
            return false;
        }
    }

    static getUserName() {
        const sessionState = store.getState()[SESSION_STATE];
        return sessionState?.[SESSION_USER]?.[SESSION_USER_USERNAME] || 'No username';
    }

    static getInstance() {
        return new SessionService();
    }
}