//Api config and endpoints
import {setIsAuthenticatingAction, setSessionUserAction} from "@/library/redux/actions/session-actions";
import { SessionService } from "@/library/services/session/SessionService";

export default {
    apiBaseUrl: process.env.NEXT_PUBLIC_TRU_JOB_API_URL,
    endpoints: {
        settings: '/settings',
        menu: '/menu',
        site: '/site',
        page: '/page',
        block: '/block',
        login: '/auth/login',
        checkToken: '/auth/token/user',
        tokenRefresh: '/auth/api-token/generate',
        auth: {
            view: '/auth/view',
            login: '/auth/login',
            logout: '/auth/logout',
            register: '/auth/register',
            forgotPassword: '/auth/forgot-password',
            resetPassword: '/auth/reset-password',
            verifyEmail: '/auth/verify-email',
            resendVerificationEmail: '/auth/resend-verification-email',
        },
        user: {
            profile: '/user/profile',
            update: '/user/update',
            delete: '/user/delete',
            create: '/user/create',
            forgotPassword: '/user/forgot-password',
            resetPassword: '/user/reset-password',
            verifyEmail: '/user/verify-email',
            resendVerificationEmail: '/user/resend-verification-email',
        }
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
