import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
    setIsAuthenticatingAction,
    setSessionErrorAction,
    setSessionLocalStorage, setSessionUserAction
} from "@/library/redux/actions/session-actions";
import { isNotEmpty } from "@/helpers/utils";
import { SessionService } from "@/library/services/session/SessionService";

export class TruJobApiMiddleware {
    config = null;
    apiMiddleware = null;

    constructor() {
        this.config = truJobApiConfig;
        this.apiMiddleware = ApiMiddleware.getInstance();
    }

    async loginRequest(query = {}, data = {}) {
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.auth.login}`,
            method: 'POST',
            query,
            data
        })
    }

    async registerUserRequest(query = {}, data = {}) {
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.auth.register}`,
            method: 'POST',
            query,
            data
        })
    }

    async menuRequest(name, query = {}, data = {}) {
        if (!name || name === '') {
            throw new Error('Menu name is required');
        }
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.menu}/${name}`,
            method: 'GET',
            query,
            data
        })
    }

    async siteRequest(slug, query = {}, data = {}) {
        if (!slug || slug === '') {
            throw new Error('Site slug is required');
        }
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.site}/${slug}`,
            method: 'GET',
            query,
            data
        })
    }

    async settingsRequest(query = {}, data = {}) {
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.settings}`,
            method: 'GET',
            query,
            data
        })
    }

    async pageRequest(page, query = {}, data = {}) {
        if (!page || page === '') {
            throw new Error('Page slug is required');
        }
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.page}/${page}`,
            method: 'GET',
            query,
            data
        })
    }
    async itemRequest(page, query = {}, data = {}) {
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.page}/${page}`,
            method: 'GET',
            query,
            data
        })
    }


    async getSessionToken(url, requestData, headers = {}) {
        try {
            const responseData = await ApiMiddleware.getInstance().resourceRequest({
                endpoint: url,
                method: 'POST',
                data: requestData
            })
            const token = responseData?.data?.token?.plainTextToken;
            const expiresAt = responseData?.data?.token?.accessToken?.expires_at_timestamp;
            if (!isNotEmpty(token)) {
                setSessionErrorAction('Token not found')
                setIsAuthenticatingAction(false)
                return false;
            }
            if (!isNotEmpty(expiresAt)) {
                setSessionErrorAction('Token expiry not found')
                setIsAuthenticatingAction(false)
                return false;
            }
            setSessionLocalStorage(
                token,
                expiresAt
            );
            setSessionUserAction(
                SessionService.extractUserData(responseData?.data?.user),
                token,  
                expiresAt,
                true
            )
            setIsAuthenticatingAction(false)
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
                ApiMiddleware.getInstance().resourceRequest({
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
        return ApiMiddleware.getInstance();
    }

    static getInstance() {
        return new TruJobApiMiddleware();
    }

}
