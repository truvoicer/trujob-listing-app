//Api config and endpoints
import {setIsAuthenticatingAction, setSessionUserAction} from "@/library/redux/actions/session-actions";
import { SessionService } from "@/library/services/session/SessionService";
import { features } from "process";

export default {
    apiBaseUrl: process.env.NEXT_PUBLIC_TRU_JOB_API_URL,
    endpoints: {
        order: '/order',
        orderItem: '/order/:orderId/item',
        address: '/locale/address',
        currency: '/locale/currency',
        country: '/locale/country',
        region: '/locale/region',
        category: '/category',
        brand: '/brand',
        productType: '/product-type',
        color: '/color',
        productType: '/product-type',
        review: '/review',
        feature: '/feature',
        product: '/product',
        media: '/media',
        price: '/price',
        priceType: '/price-type',
        paymentMethod: '/payment-method',
        paymentGateway: '/payment-gateway',
        taxRate: '/tax-rate',
        discount: '/discount',
        shippingMethod: '/shipping/method',
        shippingZone: '/shipping/zone',
        shippingRestriction: '/shipping/method/:shippingMethod/restriction',
        productFollow: '/product/:productId/follow',
        productFeature: '/product/:productId/feature',
        productReview: '/product/:productId/review',
        productCategory: '/product/:productId/category',
        productBrand: '/product/:productId/brand',
        productColor: '/product/:productId/color',
        productProductType: '/product/:productId/product-type',
        productPrice: '/product/:productId/price',
        productProductType: '/product/:productId/product-type',
        productTransaction: '/product/:productId/transaction',
        settings: '/settings',
        menu: '/menu',
        menuItem: '/menu/%s/item',
        site: '/site',
        page: '/page',
        block: '/block',
        pageBlock: '/page/%s/block',
        pageBlockRel: '/page/%s/block/rel',
        sidebar: '/sidebar',
        widget: '/widget',
        sidebarWidget: '/sidebar/%s/widget',
        sidebarWidgetRel: '/sidebar/%s/widget/rel',
        pagination: '/pagination',
        login: '/auth/login',
        role: '/role',
        checkToken: '/auth/token/user',
        tokenRefresh: '/auth/api-token/generate',
        enum: '/enum',
        auth: {
            view: '/auth/show',
            login: '/auth/login',
            logout: '/auth/logout',
            register: '/auth/register',
            forgotPassword: '/auth/forgot-password',
            resetPassword: '/auth/reset-password',
            verifyEmail: '/auth/verify-email',
            resendVerificationEmail: '/auth/resend-verification-email',
        },
        user: '/user',
    },
    tokenResponseHandler: async (response) => {
            const responseData = await response.json();
            setSessionUserAction(
                SessionService.extractUserData(responseData?.data?.user),
                responseData?.data?.token?.plainTextToken,
                responseData?.data?.token?.accessToken?.expires_at_timestamp,
                true
            )
            setIsAuthenticatingAction(false)
    },
    headers: {
        default: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        upload: {}
    },
    token: process.env.NEXT_PUBLIC_TRU_JOB_API_TOKEN,
}
