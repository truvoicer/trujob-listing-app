import { isObject, isObjectEmpty } from "@/helpers/utils";
import {
    setIsAuthenticatingAction, setSessionErrorAction,
} from "@/library/redux/actions/session-actions";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { AppManager } from "@/library/AppManager";
import { SessionService } from "@/library/services/session/SessionService";

export class ApiMiddleware {
    static METHOD = {
        GET: 'GET',
        POST: 'POST',
        PATCH: 'PATCH',
        DELETE: 'DELETE',
    }

    errors = [];

    buildQueryString(queryObject = false) {
        if (queryObject.length === 0) {
            return "";
        }
        let esc = encodeURIComponent;
        return Object.keys(queryObject)
            .map(k => esc(k) + '=' + esc(queryObject[k]))
            .join('&');
    }

    static async getGlobalMeta() {
        // const settings = await getSiteSettings();
        // if (!isNotEmpty(settings?.settings?.google_login_client_id)) {
        //     return false;
        // }
        // let extraData = {};
        // let blogName = settings?.settings?.blogname || '';
        // let favicon = settings?.settings?.favicon;
        //
        // if (favicon) {
        //     extraData = {
        //         icons: {
        //             icon: favicon,
        //             shortcut: favicon,
        //             apple: favicon,
        //             other: {
        //                 rel: 'icon',
        //                 url: favicon,
        //             },
        //         },
        //     };
        // }
        // return {
        //     title: {
        //         template: `%s | ${blogName}`,
        //         default: blogName, // a default is required when creating a template
        //     },
        //     other: {
        //         'google_login_client_id': settings?.settings?.google_login_client_id
        //     },
        //     ...extraData
        // };
        return {};
    }

    getHeaders(config, upload = false) {
        if (upload) {
            return config.headers.upload;
        }
        return config.headers.default;
    }

    buildPublicBearerToken() {
        return truJobApiConfig?.token;
    }

    getAuthHeader(protectedReq = false) {
        let token;
        if (protectedReq) {
            token = this.getProtectedSessionToken();
            if (!token) {
                return false;
            }
        } else {
            token = this.getPublicSessionToken();
            if (!token) {
                return false;
            }
        }

        if (!token) {
            return false;
        }
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    handleTokenResponse({ result, config, appKey }) {
        if (typeof config?.tokenResponseHandler !== 'function') {
            return false;
        }
        return config.tokenResponseHandler(result, appKey);
    }

    async validateToken() {
        if (!SessionService.getSessionObject()) {
            setIsAuthenticatingAction(false)
            return false;
        }
        try {
            return !!this.handleTokenResponse({
                response: await this.resourceRequest({
                    endpoint: truJobApiConfig.endpoints.checkToken,
                    method: 'GET',
                    protectedReq: true
                })
            });
        } catch (error) {
            setSessionErrorAction(error)
            setIsAuthenticatingAction(false)
        }
    }

    async resourceRequest({
        endpoint,
        query = {},
        data = {},
        method,
        upload = false,
        protectedReq = false,
        headers = null
    }) {
        if (!method) {
            throw new Error('Method not set');
        }
        try {
            return await this.runRequest({
                config: truJobApiConfig,
                method: method,
                endpoint,
                query,
                data,
                upload,
                protectedReq,
                headers
            });
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    getProtectedSessionToken() {
        const sessionObject = SessionService.getSessionObject();
        console.log('sessionObject', sessionObject);
        if (!sessionObject) {
            return false;
        }
        return sessionObject?.token;
    }

    getPublicSessionToken() {
        return this.buildPublicBearerToken();
    }

    buildHeaders({
        protectedReq = false,
        upload = false,
        config,
        headers = null,
    }) {
        let buildHeadersData = (headers && isObject(headers)) ? headers : this.getHeaders(config, upload);
        const authHeader = this.getAuthHeader(protectedReq);
        if (!authHeader) {
            return false;
        }
        buildHeadersData = { ...buildHeadersData, ...authHeader };

        if (upload) {
            buildHeadersData = {
                ...buildHeadersData,
            };
        }

        return buildHeadersData;
    }

    async runRequest({
        config,
        method,
        endpoint,
        query = {},
        data = {},
        headers = null,
        upload = false,
        protectedReq = false,
    }) {
        const requestUrl = this.buildRequestUrl(`${config.apiBaseUrl}${endpoint}`, query);
        const buildHeadersData = this.buildHeaders({
            protectedReq,
            upload,
            config,
            headers,
        });
        if (!buildHeadersData) {
            return false;
        }
        let request = {
            method,
            headers: buildHeadersData,
        };
        let body;
        if (upload) {
            body = data;
        } else {
            body = JSON.stringify(data);
        }
        switch (method) {
            case ApiMiddleware.METHOD.GET.toUpperCase():
            case ApiMiddleware.METHOD.GET.toLowerCase():
                request = {
                    ...request,
                    method: 'GET',
                };
                break;
            case ApiMiddleware.METHOD.POST.toUpperCase():
            case ApiMiddleware.METHOD.POST.toLowerCase():
                request = {
                    ...request,
                    method: 'POST',
                    body,
                };
                break;
            case ApiMiddleware.METHOD.PATCH.toUpperCase():
            case ApiMiddleware.METHOD.PATCH.toLowerCase():
                request = {
                    ...request,
                    method: 'PATCH',
                    body,
                };
                break;
            case ApiMiddleware.METHOD.DELETE.toUpperCase():
            case ApiMiddleware.METHOD.DELETE.toLowerCase():
                request = {
                    ...request,
                    method: 'DELETE',
                    body,
                };
                break;
            default:
                throw new Error(`Method not supported ${method}`);
        }

        if (AppManager.getInstance().isDebug()) {
            console.log('ApiMiddleware.runRequest', { requestUrl, request });
        }
        return await this.handleResponse(
            requestUrl,
            await fetch(
                requestUrl,
                request,
            )
        );
    }

    buildRequestUrl(url, queryObject = {}) {
        let queryString = '';
        if (!isObjectEmpty(queryObject)) {
            queryString = `/?${this.buildQueryString(queryObject)}`;
        }
        return `${url}${queryString}`;
    }

    async handleResponse(requestUrl, response) {
        if (!response) {
            return false;
        }
        const responsePromise = await response;
        const responseData = await responsePromise.json();
        switch (responsePromise?.status) {
            case 200:
            case 202:
                return responseData;
            default:
                this.addError({
                    statusCode: responsePromise?.status, 
                    statusText: responsePromise?.statusText, 
                    requestUrl,
                    response: responseData
                });
                return false;
        }
    }

    addError(code, message = null, data = {}) {
        this.errors.push({
            code,
            message,
            data
        });
    }

    getErrors() {
        return this.errors;
    }

    hasErrors() {
        return this.errors.length > 0;
    }

    static getInstance() {
        return new ApiMiddleware();
    }

}
