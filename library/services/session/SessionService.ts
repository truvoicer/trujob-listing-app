import { isSet } from "@/helpers/utils";
import {
  setIsAuthenticatingAction,
  setSessionUserAction,
} from "@/library/redux/actions/session-actions";
import {
  SESSION_STATE,
  SESSION_USER,
  SESSION_USER_USERNAME,
} from "@/library/redux/constants/session-constants";
import { sessionUserData, SessionUserState } from "@/library/redux/reducers/session-reducer";
import store from "@/library/redux/store";
import { User } from "@/types/User";

export class SessionService {
  static AUTHORIZATION = {
    ERROR: {
      CODE: {
        INVALID_USER_ROLES: "invalid_user_roles",
        UNAUTHORIZED: "unauthorized",
      },
    },
  };

  static initUserData() {
    return sessionUserData;
  }
  
  static extractUserData(
    data: User | Record<string, unknown>
  ): SessionUserState {
    if (typeof data !== "object") {
      return {} as SessionUserState;
    }
    const userData: SessionUserState = {};
    Object.keys(sessionUserData).forEach((field) => {
      if (!data.hasOwnProperty(field)) {
        return;
      }
      userData[field] = data[field];
    });
    return userData;
  }

  static async handleTokenResponse(
    token: string,
    tokenExpiry: number,
    user: User
  ) {
    if (!token) {
      console.error("Token not found");
      console.log({
        message: "Token not found",
        token: token,
        tokenExpiry: tokenExpiry,
        user: user,
      });
      setIsAuthenticatingAction(false);
      return false;
    }
    if (!user) {
      console.log("User not found");
      setIsAuthenticatingAction(false);
      return false;
    }
    SessionService.setSessionLocalStorage(token, tokenExpiry);
    setSessionUserAction(
      SessionService.extractUserData(user),
      token,
      tokenExpiry,
      true
    );
    setIsAuthenticatingAction(false);
    return true;
  }

  static logout() {
    setSessionUserAction(sessionUserData);
    SessionService.removeLocalSession();
  }

  static setSessionLocalStorage(token, expiresAt) {
    localStorage.setItem("token", token);
    localStorage.setItem("expires_at", expiresAt);
  }

  // removes user details from localStorage
  static removeLocalSession() {
    // Clear access token and ID token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("expires_at");
  }

  static getSessionObject() {
    if (typeof localStorage === "undefined") {
      return false;
    }
    try {
      let expiresAt = localStorage.getItem("expires_at");
      let token = localStorage.getItem("token");
      if (
        !isSet(expiresAt) ||
        expiresAt === null ||
        expiresAt === "" ||
        !isSet(token) ||
        token === null ||
        token === ""
      ) {
        return false;
      }
      const expiry = JSON.parse(expiresAt);
      return {
        token: localStorage.getItem("token"),
        expires_at: expiry,
      };
    } catch (error) {
      console.log(error);
      SessionService.logout();
      return false;
    }
  }

  static getUserName() {
    const sessionState = store.getState()[SESSION_STATE];
    return (
      sessionState?.[SESSION_USER]?.[SESSION_USER_USERNAME] || "No username"
    );
  }

  static getInstance() {
    return new SessionService();
  }
}
