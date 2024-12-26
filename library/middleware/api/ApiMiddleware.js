import {fetcherApiConfig} from "../../../../../trujob-app/truvoicer-base/config/fetcher-api-config";
import {isEmpty, isNotEmpty} from "../../../../../trujob-app/truvoicer-base/library/utils";
import store from "../../../../../trujob-app/truvoicer-base/redux/store";
import {REQUEST_GET, REQUEST_POST} from "../../../../../trujob-app/truvoicer-base/library/constants/request-constants";
import {isObject, isObjectEmpty} from "@/helpers/utils";
import {
    getSessionObject,
    setIsAuthenticatingAction, setSessionErrorAction,
    setSessionUserAction
} from "@/library/redux/actions/session-actions";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import {getSignedJwt} from "@/helpers/jwt-helpers";

export class ApiMiddleware {
    buildQueryString(queryObject = false) {
        if (queryObject.length === 0) {
            return "";
        }
        let esc = encodeURIComponent;
        return "?" + Object.keys(queryObject)
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
       return truJobApiConfig?.appSecret;
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

    handleTokenResponse({result, config, appKey}) {
        if (typeof config?.tokenResponseHandler !== 'function') {
            return false;
        }
        return config.tokenResponseHandler(result, appKey);
    }

    async validateToken() {
        if (!getSessionObject()) {
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
    }

    getProtectedSessionToken() {
        const sessionObject = getSessionObject();
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
        let buildHeadersData = isObject(headers)? headers : this.getHeaders(config, upload);
        const authHeader = this.getAuthHeader(protectedReq);
        if (!authHeader) {
            return false;
        }
        buildHeadersData = {...buildHeadersData, ...authHeader};

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
            case REQUEST_GET:
            case 'get':
                request = {
                    ...request,
                    method: 'GET',
                };
                break;
            case REQUEST_POST:
            case 'post':
                request = {
                    ...request,
                    method: 'POST',
                    body,
                };
                break;
            default:
                throw new Error(`Method not supported ${method}`);
        }

        return await fetch(
            requestUrl,
            request,
        );
    }

    buildRequestUrl(url, queryObject = {}) {
        let queryString = '';
        if (!isObjectEmpty(queryObject)) {
            queryString = `/?${this.buildQueryString(queryObject)}`;
        }
        return `${url}${queryString}`;
    }

    static getInstance() {
        return new ApiMiddleware();
    }

}
