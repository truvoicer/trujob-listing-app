//Api config and endpoints
import {setIsAuthenticatingAction, setSessionUserAction} from "@/library/redux/actions/session-actions";

export default {
    apiBaseUrl: process.env.NEXT_PUBLIC_TRU_JOB_API_URL,
    endpoints: {
        settings: '/settings',
        site: '/site',
        page: '/page',
        login: '/auth/login',
        checkToken: '/auth/token/user',
        tokenRefresh: '/auth/api-token/generate',
        user: {
            profile: '/user/profile',
            update: '/admin/user/update',
            delete: '/admin/user/delete',
            create: '/admin/user/create',
            forgotPassword: '/user/forgot-password',
            resetPassword: '/user/reset-password',
            verifyEmail: '/user/verify-email',
            resendVerificationEmail: '/user/resend-verification-email',
        }
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
    token: process.env.NEXT_PUBLIC_TRU_JOB_API_TOKEN,
}
