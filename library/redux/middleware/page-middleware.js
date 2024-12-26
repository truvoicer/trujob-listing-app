import {
    setPageDataAction,
    getUserAccountMenuAction, setSiteSettingsAction,
} from "../actions/page-actions";

export function getPageDataMiddleware(data) {
    return function(dispatch) {
        return setPageDataAction(data);
    }
}

export function setSiteSettingsMiddleware(data) {
    return function(dispatch) {
        return setSiteSettingsAction(data);
    }
}

export function setUserAccountMenuMiddleware() {
    return function(dispatch) {
        return getUserAccountMenuAction();
    }
}



