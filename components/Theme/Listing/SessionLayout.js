import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_IS_AUTHENTICATING, SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionService } from "@/library/services/session/SessionService";
import { useEffect } from "react";
import { connect } from "react-redux";

function SessionLayout({ children, session }) {

    async function authViewRequest() {
        // Check if user is logged in
        // If not, redirect to login page
        const response = await TruJobApiMiddleware.getInstance().authViewRequest();
        console.log({ response });
        if (!SessionService.handleTokenResponse(response)) {
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