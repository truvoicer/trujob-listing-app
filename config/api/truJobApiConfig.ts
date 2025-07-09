import { ApiMiddlewareConfig } from "@/library/middleware/api/ApiMiddleware";
import { setIsAuthenticatingAction } from "@/library/redux/actions/session-actions";
import { SessionService } from "@/library/services/session/SessionService";

const config: ApiMiddlewareConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_TRU_JOB_API_URL,
  request: {
    post: {
      encryptedPayloadSecret: process.env.NEXT_PUBLIC_ENCRYPTED_PAYLOAD_SECRET,
    },
  },
  endpoints: {
    profile: "/user/profile",
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
  },
  tokenResponseHandler: async (response: unknown) => {
    if (!response) {
      setIsAuthenticatingAction(false);
      return false;
    }
    const token = (response as any)?.data?.token?.plainTextToken;
    const tokenExpiry =
      (response as any)?.data?.token?.accessToken?.expires_at_timestamp;
    const user = (response as any)?.data?.user;
    return SessionService.handleTokenResponse(token, tokenExpiry, user);
  },
  headers: {
    default: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    upload: {},
  },
  token: process.env.NEXT_PUBLIC_TRU_JOB_API_TOKEN,
};

export default config;
