//Api config and endpoints
import {
    setIsAuthenticatingAction,
    setSessionLocalStorage,
    setSessionUserAction
} from "@/library/redux/actions/session-actions";

export default {
    apiBaseUrl: process.env.NEXT_PUBLIC_FETCHER_API_URL,
    endpoints: {
        login: '/login',
        checkToken: '/backend/auth/token/user',
        tokenRefresh: '/backend/session/api-token/generate',
        service: '/backend/service',
        categories: '/backend/category/list',
        provider: '/backend/provider',
    },
    tokenResponseHandler: async (response) => {
        const responseData = await response.json();
        if (responseData?.status === 'success') {
            setSessionUserAction(response.data, true)
        } else {
            // removeLocalSession()
        }
        setIsAuthenticatingAction(false)
    },
    headers: {
        default: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        upload: {}
    },
    appSecret: process.env.NEXT_PUBLIC_FETCHER_API_APP_SECRET,
}
