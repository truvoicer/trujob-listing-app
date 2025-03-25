import { setIsAuthenticatingAction, setSessionLocalStorage, setSessionUserAction } from "@/library/redux/actions/session-actions";
import { SESSION_AUTH_PROVIDER, SESSION_AUTH_PROVIDER_USER_ID, SESSION_USER_EMAIL, SESSION_USER_FIRSTNAME, SESSION_USER_ID, SESSION_USER_LASTNAME, SESSION_USER_ROLES, SESSION_USER_USERNAME } from "@/library/redux/constants/session-constants";

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

    static handleTokenResponse(response) {
        if (!response) {
            setIsAuthenticatingAction(false)
            return false;
        }
        const token = response?.data?.token?.plainTextToken;
        const tokenExpiry = response?.data?.token?.accessToken?.expires_at_timestamp;
        const user = response?.data?.user;
        if (!token) {
            console.error('Token not found');
            setIsAuthenticatingAction(false)
            return false;
        }
        if (!user) {
            console.error('User not found');
            setIsAuthenticatingAction(false)
            return false;
        }
        setSessionLocalStorage(token, tokenExpiry);
        setSessionUserAction(SessionService.extractUserData(user), token, tokenExpiry, true);
        setIsAuthenticatingAction(false)
        return true;
    }

    getInstance() {
        return new SessionService();
    }
}