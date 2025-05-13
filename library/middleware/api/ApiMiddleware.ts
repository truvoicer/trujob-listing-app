import { isObject, isObjectEmpty } from "@/helpers/utils";
import {
    setAuthenticatedAction,
    setIsAuthenticatingAction, setSessionErrorAction,
    setShowLoginModalAction,
} from "@/library/redux/actions/session-actions";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { SessionService } from "@/library/services/session/SessionService";
import { DebugHelpers } from "@/helpers/DebugHelpers";
export type ErrorItem = {
    code: string;
    message: string | null;
    data: any;
}
export type Method = "GET" | "POST" | "PATCH" | "DELETE" | 'get' | 'post' | 'patch' | 'delete';
export type MethodObject = {
    GET: 'GET' | 'get';
    POST: 'POST' | 'post';
    PATCH: 'PATCH' | 'patch';
    DELETE: 'DELETE' | 'delete';
}
export type ResourceRequest = {
    endpoint: string;
    query?: any;
    data?: any;
    method: Method;
    upload?: boolean;
    protectedReq?: boolean;
    headers?: any;
}
export class ApiMiddleware {
    static METHOD: MethodObject = {
        GET: 'GET',
        POST: 'POST',
        PATCH: 'PATCH',
        DELETE: 'DELETE',
    }

    errors: Array<ErrorItem> = [];

    buildQueryString(queryObject: any = false) {
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

    getHeaders(config: any, upload: boolean = false) {
        if (upload) {
            return config.headers.upload;
        }
        return config.headers.default;
    }

    buildPublicBearerToken() {
        return truJobApiConfig?.token;
    }

    getAuthHeader(protectedReq: boolean = false) {
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

    handleTokenResponse({ result, config, appKey }: {
        result: Promise<any>,
        config?: any | null,
        appKey?: string
    }) {
        if (typeof config?.tokenResponseHandler !== 'function') {
            return false;
        }
        return config.tokenResponseHandler(result, appKey);
    }

    async resourceRequest({
        endpoint,
        query = {},
        data = {},
        method,
        upload = false,
        protectedReq = false,
        headers = null
    }: ResourceRequest) {
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
            DebugHelpers.log(DebugHelpers.ERROR, error);
            return false;
        }
    }

    getProtectedSessionToken() {
        const sessionObject = SessionService.getSessionObject();
        DebugHelpers.log('debug', 'ApiMiddleware.getProtectedSessionToken', {
            sessionObject,
        });
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
    }: {
        protectedReq?: boolean,
        upload?: boolean,
        config: any,
        headers?: any | null,
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
    }: {
        config: any,
        method: "GET" | "POST" | "PATCH" | "DELETE" | 'get' | 'post' | 'patch' | 'delete',
        endpoint: string,
        query?: any,
        data?: any,
        headers?: any | null,
        upload?: boolean,
        protectedReq?: boolean,
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
        let request: {
            method: string,
            headers: any,
            body?: any
        } = {
            method,
            headers: buildHeadersData,
        };
        let body: any = null;
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

        DebugHelpers.log('debug', 'ApiMiddleware.runRequest', {
            requestUrl,
            request,
        });

        return await this.handleResponse(
            requestUrl,
            await fetch(
                requestUrl,
                request,
            )
        );
    }

    buildRequestUrl(url: string, queryObject: any = {}) {
        let queryString = '';
        if (!isObjectEmpty(queryObject)) {
            queryString = `/?${this.buildQueryString(queryObject)}`;
        }
        return `${url}${queryString}`;
    }

    handleUnauthorizedResponse(response: Response, data: any): void {
        DebugHelpers.log(DebugHelpers.DEBUG, 'handleUnauthorizedResponse', { response, data });
        SessionService.removeLocalSession();
        setAuthenticatedAction(false);
        setIsAuthenticatingAction(false)
        setShowLoginModalAction(true);
    }

    async handleResponse(requestUrl: string, response: Response | Promise<Response>) {
        if (!response) {
            return false;
        }
        const responsePromise = await response;
        const responseData = await responsePromise.json();
        switch (responsePromise?.status) {
            case 200:
            case 201:
            case 202:
                return responseData;
            case 401:
                this.handleUnauthorizedResponse(responsePromise, responseData);
            default:
                DebugHelpers.log(DebugHelpers.DEBUG, {responsePromise, responseData});
                this.addError(
                    'api_error',
                    responseData?.message || 'API Error',
                    {
                        statusCode: responsePromise?.status,
                        statusText: responsePromise?.statusText,
                        requestUrl,
                        response: responseData
                    }
                );
                return false;
        }
    }

    addError(code: string, message: string|null = null, data: any = {}) {
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
