import {
    setIsAuthenticatingAction,
    setSessionErrorAction,
    setSessionLocalStorage,
    setSessionUserAction
} from "../actions/session-actions";
import {buildWpApiUrl} from "../../library/api/wp/middleware";
import {wpApiConfig} from "../../config/wp-api-config";
import {wpResourceRequest} from "@/truvoicer-base/library/api/wordpress/middleware";
import {isNotEmpty, isObject} from "@/truvoicer-base/library/utils";

export async function getSessionTokenMiddleware(url, requestData, headers = {}) {
    try {
        const response = await wpResourceRequest({
            endpoint: url,
            method: 'POST',
            data: requestData
        })

        const responseData = await response.json();

        switch (responseData?.status) {
            case 'success':
                if (!isNotEmpty(responseData?.data?.token)) {
                    setSessionErrorAction('Token not found')
                    setIsAuthenticatingAction(false)
                    return false;
                }
                if (!isNotEmpty(responseData?.expiresAt)) {
                    setSessionErrorAction('Token expiry not found')
                    setIsAuthenticatingAction(false)
                    return false;
                }
                setSessionLocalStorage(responseData.data.token, responseData.expiresAt)
                setSessionUserAction(
                    isObject(responseData?.data)
                    ? responseData.data
                    : {},
                    true
                )
                setIsAuthenticatingAction(false)
                break;
            default:
                setSessionErrorAction(responseData.data)
                setIsAuthenticatingAction(false)
                break;
        }
        return responseData;
    } catch (error) {
        setSessionErrorAction(error)
        setIsAuthenticatingAction(false)
        return false;
    }
}

export function createUserMiddleware(requestData, callback) {
    return wpResourceRequest({
        endpoint: wpApiConfig.endpoints.createUser,
        method: 'POST',
        data: requestData
    })
        .then(response => {
            callback(false, response.data);
        })
        .catch(error => {
            console.error(error)
            callback(true, error?.response?.data);
        });
}
