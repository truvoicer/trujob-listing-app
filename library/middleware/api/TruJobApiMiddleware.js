import {ApiMiddleware} from "@/library/middleware/api/ApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
    setIsAuthenticatingAction,
    setSessionErrorAction,
    setSessionLocalStorage, setSessionUserAction
} from "@/library/redux/actions/session-actions";
import {isNotEmpty} from "@/helpers/utils";

export class TruJobApiMiddleware {
    apiMiddleware = null;
    config = null;

    constructor() {
        this.config = truJobApiConfig;
        this.apiMiddleware = ApiMiddleware.getInstance();
    }


    async settingsRequest(query = {}, data = {}) {
        return await this.apiMiddleware.resourceRequest({
            endpoint: `${this.config.endpoints.settings}`,
            method: 'GET',
            query,
            data
        })
    }

    async pageRequest(page, query = {}, data = {}) {
        return await this.apiMiddleware.resourceRequest({
            endpoint: `${this.config.endpoints.page}/${page}`,
            method: 'GET',
            query,
            data
        })
    }
    async itemRequest(page, query = {}, data = {}) {
        return await this.apiMiddleware.resourceRequest({
            endpoint: `${this.config.endpoints.page}/${page}`,
            method: 'GET',
            query,
            data
        })
    }


    async getSessionToken(url, requestData, headers = {}) {
        try {
            const response = await this.apiMiddleware.resourceRequest({
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

    async createUser(data) {
        try {
            return await this.handleResponse(
                this.apiMiddleware.resourceRequest({
                    endpoint: this.config.endpoints.user.create,
                    method: ApiMiddleware.REQUEST_POST,
                    data: data
                })
            );
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    getApiMiddleware() {
        return this.apiMiddleware;
    }

    static getInstance() {
        return new TruJobApiMiddleware();
    }

}
