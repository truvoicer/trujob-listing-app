import { isObject, isObjectEmpty } from "@/helpers/utils";
import {
  setAuthenticatedAction,
  setIsAuthenticatingAction,
  setShowLoginModalAction,
} from "@/library/redux/actions/session-actions";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { SessionService } from "@/library/services/session/SessionService";
import { DebugHelpers } from "@/helpers/DebugHelpers";
import { JWTHelpers } from "@/helpers/JWTHelpers";

export type Encrypted = {
  REQUEST: {
    ENCRYPTED_REQUEST: string;
    ENCRYPTED_REQUEST_DATA: string;
    ENCRYPTED_REQUEST_PAYLOAD: string;
  };
  RESPONSE: {
    ENCRYPTED_RESPONSE: string;
    ENCRYPTED_RESPONSE_DATA: string;
    ENCRYPTED_RESPONSE_PAYLOAD: string;
  };
};
export type ApiMiddlewareConfig = {
  apiBaseUrl: string;
  request: {
    post: {
      encryptedPayloadSecret: string;
    };
  };
  endpoints: {
    profile: "/user/profile",
    userProduct: "/user/product",
    order: "/order",
    orderShippingMethod: "/order/:orderId/shipping/method",
    orderSummary: "/order/:orderId/summary",
    orderTransaction: "/order/:orderId/transaction",
    orderItem: "/order/:orderId/item",
    address: "/locale/address",
    currency: "/locale/currency",
    country: "/locale/country",
    region: "/locale/region",
    category: "/category",
    categoryProduct: "/product/:productId/category",
    brand: "/brand",
    productType: "/product-type",
    color: "/color",
    review: "/review",
    feature: "/feature",
    product: "/product",
    media: "/media",
    price: "/price",
    priceType: "/price-type",
    paymentMethod: "/payment-method",
    sitePaymentGateway: "/site/payment-gateway",
    paymentGateway: "/payment-gateway",
    taxRate: "/tax-rate",
    discount: "/discount",
    shipping: "/shipping",
    shippingMethod: "/shipping/method",
    shippingZone: "/shipping/zone",
    shippingRestriction: "/shipping/method/:shippingMethodId/restriction",
    shippingRate: "/shipping/rate",
    shippingMethodRate: "/shipping/method/:shippingMethodId/rate",
    productPriceType: "/product/:productId/price-type",
    productFollow: "/product/:productId/follow",
    productFeature: "/product/:productId/feature",
    productReview: "/product/:productId/review",
    productCategory: "/product-category",
    productBrand: "/product/:productId/brand",
    productColor: "/product/:productId/color",
    productProductCategory: "/product/:productId/product-category",
    productPrice: "/product/:productId/price",
    productTransaction: "/product/:productId/transaction",
    productShippingMethod: "/product/:productId/shipping/method",
    paypal: {
      order: "/order/:orderId/transaction/:transactionId/payment-gateway/paypal",
    },
    stripe: {
      order: "/order/:orderId/transaction/:transactionId/payment-gateway/stripe",
    },
    settings: "/settings",
    menu: "/menu",
    menuItem: "/menu/%s/item",
    site: "/site",
    page: "/page",
    block: "/block",
    pageBlock: "/page/%s/block",
    pageBlockRel: "/page/%s/block/rel",
    sidebar: "/sidebar",
    widget: "/widget",
    sidebarWidget: "/sidebar/%s/widget",
    sidebarWidgetRel: "/sidebar/%s/widget/rel",
    pagination: "/pagination",
    login: "/auth/login",
    role: "/role",
    checkToken: "/auth/token/user",
    tokenRefresh: "/auth/api-token/generate",
    enum: "/enum",
    subscription: {
      tenureType: "/subscription/tenure-type",
      intervalUnit: "/subscription/interval-unit",
      setupFeeFailureAction: "/subscription/setup-fee-failure-action",
    },
    session: {
      user: {
        show: "/session/user/show",
        update: "/session/user/update",
        "api-token": {
          index: "/session/user/api-token",
          show: "/session/user/api-token/show",
          store: "/session/user/api-token/store",
          delete: "/session/user/api-token/delete",
        },
      },
    },
    auth: {
      view: "/auth/show",
      login: "/auth/login",
      logout: "/auth/logout",
      register: "/auth/register",
      password: {
        reset: {
          tokenCheck: "/auth/password/reset/token-check",
          request: "/auth/password/reset/request",
          confirmation: "/auth/password/reset/confirmation",
        },
      },
      verifyEmail: "/auth/verify-email",
      resendVerificationEmail: "/auth/resend-verification-email",
    },
    user: "/user",
  };
  tokenResponseHandler?: (response: unknown) => boolean;
  headers: {
    default: Record<string, string>;
    upload: Record<string, string>;
  };
  token: string | null;
};

export type ErrorItem = {
  code: string;
  message: string | null;
  data: Record<string, unknown> | null;
};
export type Method =
  | "GET"
  | "POST"
  | "PATCH"
  | "DELETE"
  | "get"
  | "post"
  | "patch"
  | "delete";
export type MethodObject = {
  GET: "GET" | "get";
  POST: "POST" | "post";
  PATCH: "PATCH" | "patch";
  DELETE: "DELETE" | "delete";
};
export type ResourceRequest = {
  endpoint: string;
  query?: Record<string, unknown> | null;
  data?: Record<string, unknown> | null;
  method: Method;
  upload?: boolean;
  protectedReq?: boolean;
  encrypted?: boolean;
  headers?: Record<string, unknown> | null;
};
export class ApiMiddleware {
  static ENCRYPTED: Encrypted = {
    REQUEST: {
      ENCRYPTED_REQUEST: "encrypted_request",
      ENCRYPTED_REQUEST_DATA: "encrypted_request_data",
      ENCRYPTED_REQUEST_PAYLOAD: "payload",
    },
    RESPONSE: {
      ENCRYPTED_RESPONSE: "encrypted_response",
      ENCRYPTED_RESPONSE_DATA: "encrypted_response_data",
      ENCRYPTED_RESPONSE_PAYLOAD: "payload",
    },
  }
  static METHOD: MethodObject = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE",
  };

  request: unknown;
  response: Response | Promise<Response> | null = null;
  responseData: Record<string, unknown> | null = null;

  config?: ApiMiddlewareConfig;

  errors: Array<ErrorItem> = [];
  private disableLoginModal: boolean = false;

  getRequest() {
    return this.request;
  }
  getResponse() {
    return this.response;
  }
  getResponseData() {
    return this.responseData;
  }
  setRequest(request: unknown) {
    this.request = request;
    return this;
  }
  setResponse(response: Response | Promise<Response>) {
    this.response = response;
    return this;
  }
  setResponseData(responseData: Record<string, unknown> | null) {
    this.responseData = responseData;
    return this;
  }
  getDisableLoginModal(): boolean {
    return this.disableLoginModal;
  }

  setDisableLoginModal(value: boolean): ApiMiddleware {
    this.disableLoginModal = value;
    return this;
  }

  buildQueryString(queryObject: any = false) {
    if (queryObject.length === 0) {
      return "";
    }
    let esc = encodeURIComponent;
    return Object.keys(queryObject)
      .map((k) => esc(k) + "=" + esc(queryObject[k]))
      .join("&");
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

  getHeaders(config: ApiMiddlewareConfig, upload: boolean = false) {
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

  handleTokenResponse(response: unknown): boolean {
    if (typeof this.config?.tokenResponseHandler !== "function") {
      return false;
    }
    return this.config.tokenResponseHandler(response);
  }

  async resourceRequest({
    endpoint,
    query = {},
    data = {},
    method,
    upload = false,
    protectedReq = false,
    headers = null,
    encrypted = false,
  }: ResourceRequest) {
    if (!method) {
      throw new Error("Method not set");
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
        headers,
        encrypted,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getProtectedSessionToken() {
    const sessionObject = SessionService.getSessionObject();
    DebugHelpers.log(
      DebugHelpers.INTENSE,
      "ApiMiddleware.getProtectedSessionToken",
      {
        sessionObject,
      }
    );
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
    protectedReq?: boolean;
    upload?: boolean;
    config: ApiMiddlewareConfig;
    headers?: any | null;
  }) {
    let buildHeadersData =
      headers && isObject(headers) ? headers : this.getHeaders(config, upload);
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

  private async buildEncryptedBodyData(
    config: ApiMiddlewareConfig,
    data: Record<string, unknown> | null
  ) {
    if (!data) {
      return null;
    }
    if (typeof data !== "object" || isObjectEmpty(data)) {
      return data;
    }

    const payloadSecret = config.request.post.encryptedPayloadSecret;

    const encryptedData: string = await JWTHelpers.getSignedJwt({
      secret: payloadSecret,
      payload: data,
    });
    
    return {
      [ApiMiddleware.ENCRYPTED.REQUEST.ENCRYPTED_REQUEST]: true,
      [ApiMiddleware.ENCRYPTED.REQUEST.ENCRYPTED_REQUEST_DATA]: encryptedData,
    };
  }

  private async buildBodyData(
    config: ApiMiddlewareConfig,
    data: Record<string, unknown> | null,
    upload: boolean,
    encrypted: boolean = false
  ): Promise<string | Record<string, unknown> | null> {
    let newData = data;
    if (encrypted) {
      newData = await this.buildEncryptedBodyData(config, data);
    }
    if (upload) {
      return newData;
    }
    return JSON.stringify(newData);
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
    encrypted = false,
  }: {
    config: ApiMiddlewareConfig;
    method:
      | "GET"
      | "POST"
      | "PATCH"
      | "DELETE"
      | "get"
      | "post"
      | "patch"
      | "delete";
    endpoint: string;
    query?: Record<string, unknown> | null;
    data?: Record<string, unknown> | null;
    headers?: Record<string, unknown> | null;
    upload?: boolean;
    protectedReq?: boolean;
    encrypted?: boolean;
  }) {
    const requestUrl = this.buildRequestUrl(
      `${config.apiBaseUrl}${endpoint}`,
      query
    );
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
      method: string;
      headers: Record<string, string>;
      body?: Record<string, unknown> | null;
    } = {
      method,
      headers: buildHeadersData,
    };

    const body: string | Record<string, unknown> | null = await this.buildBodyData(
      config,
      data,
      upload,
      encrypted
    );

    switch (method) {
      case ApiMiddleware.METHOD.GET.toUpperCase():
      case ApiMiddleware.METHOD.GET.toLowerCase():
        request = {
          ...request,
          method: "GET",
        };
        break;
      case ApiMiddleware.METHOD.POST.toUpperCase():
      case ApiMiddleware.METHOD.POST.toLowerCase():
        request = {
          ...request,
          method: "POST",
          body,
        };
        break;
      case ApiMiddleware.METHOD.PATCH.toUpperCase():
      case ApiMiddleware.METHOD.PATCH.toLowerCase():
        request = {
          ...request,
          method: "PATCH",
          body,
        };
        break;
      case ApiMiddleware.METHOD.DELETE.toUpperCase():
      case ApiMiddleware.METHOD.DELETE.toLowerCase():
        request = {
          ...request,
          method: "DELETE",
          body,
        };
        break;
      default:
        throw new Error(`Method not supported ${method}`);
    }

    DebugHelpers.log(DebugHelpers.INTENSE, "ApiMiddleware.runRequest", {
      requestUrl,
      request,
    });
    this.setRequest(request);
    return await this.handleResponse(
      encrypted,
      requestUrl,
      await fetch(requestUrl, request)
    );
  }

  buildRequestUrl(url: string, queryObject: any = {}) {
    let queryString = "";
    if (!isObjectEmpty(queryObject)) {
      queryString = `/?${this.buildQueryString(queryObject)}`;
    }
    return `${url}${queryString}`;
  }

  handleUnauthorizedResponse(response: Response, data: any): void {
    console.log("handleUnauthorizedResponse", { response, data });
    this.errors.push({
      code: "unauthorized",
      message: data?.message || "Unauthorized access",
      data,
    });
    SessionService.removeLocalSession();
    setAuthenticatedAction(false);
    setIsAuthenticatingAction(false);
    if (!this.getDisableLoginModal()) {
      setShowLoginModalAction(true);
    }
  }
  handleUnProcessableResponse(response: Response, data: any): void {
    console.log("handleUnProcessableResponse", { response, data });
    this.errors.push({
      code: "unprocessable_entity",
      message: data?.message || "Unprocessable Entity",
      data,
    });
  }
  handleServerErrorResponse(response: Response, data: any): void {
    console.log("handleServerErrorResponse", { response, data });
    this.errors.push({
      code: "server_error",
      message: data?.message || "Internal Server Error",
      data,
    });
  }
  async handleResponse(
    encrypted: boolean,
    requestUrl: string,
    response: Response | Promise<Response>
  ) {
    if (!response) {
      return false;
    }
    this.setResponse(response);
    const responsePromise = await response;
    const responseData = await responsePromise.json();
    this.setResponseData(responseData);

    switch (responsePromise?.status) {
      case 200:
      case 201:
      case 202:
        if (encrypted) {
          return await this.decryptResponseData(responseData);
        }
        return responseData;
      case 401:
        this.handleUnauthorizedResponse(responsePromise, responseData);
        return false;
      case 422:
        this.handleUnProcessableResponse(responsePromise, responseData);
        return false;
      case 500:
        this.handleServerErrorResponse(responsePromise, responseData);
        return false;
      default:
        return false;
    }
  }

  async decryptResponseData(data: unknown): Promise<unknown> {
    if (!data || typeof data !== "object" || isObjectEmpty(data)) {
      throw new Error("Invalid data format for decryption");
    }

    let responseData: Record<string, unknown> = {};
    if (!data?.data || typeof data?.data !== "object" || isObjectEmpty(data?.data)) {
      responseData = data as Record<string, unknown>;
    } else {
      responseData = data.data as Record<string, unknown>;
    }

    if (!responseData.hasOwnProperty(ApiMiddleware.ENCRYPTED.RESPONSE.ENCRYPTED_RESPONSE)) {
      throw new Error("Encrypted response flag not set in data");
    }
    if (responseData[ApiMiddleware.ENCRYPTED.RESPONSE.ENCRYPTED_RESPONSE] !== true) {
      throw new Error("Encrypted response flag is not true");
    }
    if (!responseData.hasOwnProperty(ApiMiddleware.ENCRYPTED.RESPONSE.ENCRYPTED_RESPONSE_DATA)) {
      console.log("Response data does not contain encrypted response data, returning as is", responseData);
      throw new Error("Encrypted response data not set in data");
    }
    const payloadSecret = this.config?.request.post.encryptedPayloadSecret;
    if (!payloadSecret) {
      throw new Error("Payload secret not set in config");
    }
    const encryptedData = responseData[ApiMiddleware.ENCRYPTED.RESPONSE.ENCRYPTED_RESPONSE_DATA];
    if (!encryptedData) {
      throw new Error("Encrypted data not set in response data");
    }
    if (typeof encryptedData !== "string") {
      throw new Error("Encrypted data is not a string");
    }
    if (encryptedData === "") {
      throw new Error("Encrypted data is empty");
    }
    
    const decryptedData = await JWTHelpers.decodeJwt(encryptedData, payloadSecret);
    if (!decryptedData) {
      throw new Error("Decrypted data is empty");
    }
    if (!decryptedData.hasOwnProperty(ApiMiddleware.ENCRYPTED.RESPONSE.ENCRYPTED_RESPONSE_PAYLOAD)) {
      throw new Error("Decrypted data does not contain payload");
    }

    return decryptedData[ApiMiddleware.ENCRYPTED.RESPONSE.ENCRYPTED_RESPONSE_PAYLOAD];
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
