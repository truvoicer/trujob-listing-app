//Api config and endpoints
import {setSessionLocalStorage, setSessionState} from "../../redux/actions/session-actions";
import {setIsAuthenticatingAction, setSessionUserAction} from "@/library/redux/actions/session-actions";

export default {
    apiBaseUrl: process.env.NEXT_PUBLIC_TRU_JOB_API_URL,
    endpoints: {
        settings: '/settings',
        page: '/page',
        login: '/login',
        checkToken: '/auth/token/user',
        tokenRefresh: '/session/api-token/generate',
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
    appSecret: process.env.NEXT_PUBLIC_TRU_JOB_API_APP_SECRET,
}
