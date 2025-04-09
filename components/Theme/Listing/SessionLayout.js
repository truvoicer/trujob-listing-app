import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { setIsAuthenticatingAction } from "@/library/redux/actions/session-actions";
import { SESSION_IS_AUTHENTICATING, SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionService } from "@/library/services/session/SessionService";
import { useEffect } from "react";
import { connect } from "react-redux";

function SessionLayout({ children, session }) {

    async function authViewRequest() {
        
        const response = await TruJobApiMiddleware.getInstance().resourceRequest({
            endpoint: `${truJobApiConfig.endpoints.auth.view}`,
            method: ApiMiddleware.METHOD.GET,
            protectedReq: true
        });

        if (!response) {
            setIsAuthenticatingAction(false)
            return;
        }

        const sessionObject = SessionService.getSessionObject();
        if (!sessionObject) {
            return false;
        }

        if (
            !SessionService.handleTokenResponse(
                sessionObject?.token,
                sessionObject?.expires_at,
                response?.data?.user
            )
        ) {
            return;
        }

    }
    useEffect(() => {
        if (!session[SESSION_IS_AUTHENTICATING]) {
            return;
        }
        authViewRequest();
    }, [session[SESSION_IS_AUTHENTICATING]]);

    return children;
}
export default connect(
    state => ({
        session: state[SESSION_STATE]
    })
)(SessionLayout);