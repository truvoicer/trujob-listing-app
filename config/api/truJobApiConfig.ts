import store from "@/library/redux/store";

const config = {
    apiBaseUrl: process.env.NEXT_PUBLIC_TRU_JOB_API_URL,
    endpoints: {
        profile: '/user/profile',
        order: '/order',
        orderSummary: '/order/:orderId/summary',
        orderItem: '/order/:orderId/item',
        address: '/locale/address',
        currency: '/locale/currency',
        country: '/locale/country',
        region: '/locale/region',
        category: '/category',
        categoryProduct: '/product/:productId/category',
        brand: '/brand',
        productType: '/product-type',
        color: '/color',
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
        shipping: '/shipping',
        shippingMethod: '/shipping/method',
        shippingZone: '/shipping/zone',
        shippingRestriction: '/shipping/method/:shippingMethodId/restriction',
        shippingRate: '/shipping/rate',
        shippingMethodRate: '/shipping/method/:shippingMethodId/rate',
        productFollow: '/product/:productId/follow',
        productFeature: '/product/:productId/feature',
        productReview: '/product/:productId/review',
        productCategory: '/product-category',
        productBrand: '/product/:productId/brand',
        productColor: '/product/:productId/color',
        productProductCategory: '/product/:productId/product-category',
        productPrice: '/product/:productId/price',
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
        session: {
            user: {
                show: '/session/user/show',
                update: '/session/user/update',
                'api-token': {
                    index: '/session/user/api-token',
                    show: '/session/user/api-token/show',
                    store: '/session/user/api-token/store',
                    delete: '/session/user/api-token/delete',
                },
            }
        },
        auth: {
            view: '/auth/show',
            login: '/auth/login',
            logout: '/auth/logout',
            register: '/auth/register',
            password: {
                reset: {
                    tokenCheck: '/auth/password/reset/token-check',
                    request: '/auth/password/reset/request',
                    confirmation: '/auth/password/reset/confirmation',
                }
            },
            verifyEmail: '/auth/verify-email',
            resendVerificationEmail: '/auth/resend-verification-email',
        },
        user: '/user',
    },
    // tokenResponseHandler: async (response) => {
    //         const responseData = await response.json();
    //         setSessionUserAction(
    //             SessionService.extractUserData(responseData?.data?.user),
    //             responseData?.data?.token?.plainTextToken,
    //             responseData?.data?.token?.accessToken?.expires_at_timestamp,
    //             true
    //         )
    //         setIsAuthenticatingAction(false)
    // },
    headers: {
        default: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        upload: {}
    },
    token: process.env.NEXT_PUBLIC_TRU_JOB_API_TOKEN,
}

export default config;