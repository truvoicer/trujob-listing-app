import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {
    setIsAuthenticatingAction,
    setSessionErrorAction,
    setSessionLocalStorage, 
    setSessionUserAction
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

    async authViewRequest(query = {}, data = {}) {
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.auth.view}`,
            method: 'GET',
            query,
            data,
            protectedReq: true
        })
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

    async siteRequest(name, query = {}, data = {}) {
        if (!name || name === '') {
            throw new Error('Site name is required');
        }
        return await ApiMiddleware.getInstance().resourceRequest({
            endpoint: `${this.config.endpoints.site}/${name}`,
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
            throw new Error('Page name is required');
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

    
    static async handleTokenResponse(response) {
        if (!response) {
            setIsAuthenticatingAction(false)
            return false;
        }
        const token = response?.data?.token?.plainTextToken;
        const tokenExpiry = response?.data?.token?.accessToken?.expires_at_timestamp;
        const user = response?.data?.user;
        return SessionService.handleTokenResponse(token, tokenExpiry, user);
    }



    getApiMiddleware() {
        return ApiMiddleware.getInstance();
    }

    static getInstance() {
        return new TruJobApiMiddleware();
    }

}
