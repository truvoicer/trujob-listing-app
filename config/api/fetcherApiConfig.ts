//Api config and endpoints
import {
    setIsAuthenticatingAction,
    setSessionUserAction
} from "@/library/redux/actions/session-actions";
import { SessionService } from "@/library/services/session/SessionService";

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
    token: process.env.NEXT_PUBLIC_FETCHER_API_TOKEN,
}
