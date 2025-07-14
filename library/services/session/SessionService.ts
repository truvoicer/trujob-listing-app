import { COMPONENT_USER_CURRENCY_FORM, COMPONENT_USER_LOCALE_FORM } from "@/components/Theme/Constants/ComponentConstants";
import { findInObject, isSet } from "@/helpers/utils";
import {
  addSessionModalAction,
  closeSessionModalAction,
  setIsAuthenticatingAction,
  setSessionUserAction,
} from "@/library/redux/actions/session-actions";
import {
  SESSION_MODAL_COMPONENT,
  SESSION_MODAL_ID,
  SESSION_MODAL_ON_OK,
  SESSION_MODAL_PREVENT_CLOSE,
  SESSION_MODAL_SHOW,
  SESSION_MODAL_SHOW_CLOSE_BUTTON,
  SESSION_MODAL_SHOW_FOOTER,
  SESSION_MODAL_TITLE,
  SESSION_STATE,
  SESSION_USER,
  SESSION_USER_USERNAME,
} from "@/library/redux/constants/session-constants";
import {
  sessionUserData,
  SessionUserState,
} from "@/library/redux/reducers/session-reducer";
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

  static REQUIRED_FIELDS = [
    {
      field: ["settings.currency", "settings.country"],
      onFail: () => {
        console.error("Missing required field: settings.currency");
        addSessionModalAction({
          [SESSION_MODAL_ID]: "user-currency",
          [SESSION_MODAL_TITLE]: "Currency & Country Required",
          [SESSION_MODAL_COMPONENT]: COMPONENT_USER_LOCALE_FORM,
          [SESSION_MODAL_SHOW_CLOSE_BUTTON]: false,
          [SESSION_MODAL_SHOW_FOOTER]: true,
          [SESSION_MODAL_PREVENT_CLOSE]: true,
          [SESSION_MODAL_SHOW]: true,
          // [SESSION_MODAL_ON_OK]: () => {
          //   closeSessionModalAction("user-locale");
          // },
        });
      },
    },
    {
      field: "settings.currency",
      onFail: () => {
        console.error("Missing required field: settings.currency");
        addSessionModalAction({
          [SESSION_MODAL_ID]: "user-currency",
          [SESSION_MODAL_TITLE]: "Currency Required",
          [SESSION_MODAL_COMPONENT]: COMPONENT_USER_CURRENCY_FORM,
          [SESSION_MODAL_SHOW_CLOSE_BUTTON]: false,
          [SESSION_MODAL_SHOW_FOOTER]: true,
          [SESSION_MODAL_PREVENT_CLOSE]: true,
          [SESSION_MODAL_SHOW]: true,
          // [SESSION_MODAL_ON_OK]: () => {
          //   closeSessionModalAction("user-currency");
          // },
        });
      },
    },
    {
      field: "settings.country",
      onFail: () => {
        console.error("Missing required field: settings.country");
        addSessionModalAction({
          [SESSION_MODAL_ID]: "user-currency",
          [SESSION_MODAL_TITLE]: "Currency Required",
          [SESSION_MODAL_COMPONENT]: COMPONENT_USER_CURRENCY_FORM,
          [SESSION_MODAL_SHOW_CLOSE_BUTTON]: false,
          [SESSION_MODAL_SHOW_FOOTER]: true,
          [SESSION_MODAL_PREVENT_CLOSE]: true,
          [SESSION_MODAL_SHOW]: true,
          // [SESSION_MODAL_ON_OK]: () => {
          //   closeSessionModalAction("user-currency");
          // },
        });
      },
    },
    {
      field: "settings.timezone",
      onFail: () => {
        console.error("Missing required field: settings.timezone");
      },
    },
  ];

  static validateUser(data: User): boolean {
    if (!data) {
      console.error("User data is not available or empty.");
      return false;
    }
    for (const field of SessionService.REQUIRED_FIELDS) {
      if (Array.isArray(field.field)) {
        const findField = field.field
          .map((f) => findInObject(f, data))
          .find((f) => f !== undefined && f !== null);

        if (!findField || findField === "") {
          field.onFail();
          return false;
        }
      } else if (typeof field.field === "string") {
        const findField = findInObject(field.field, data);
        if (!findField || findField === "") {
          field.onFail();
        }
        return false;
      }
    }
    return true;
  }

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
    if (!SessionService.validateUser(user)) {
      console.error("Invalid user data", user);
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
