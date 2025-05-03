import LoginBlock from "@/components/blocks/Auth/LoginBlock";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { AppModalContext } from "@/contexts/AppModalContext";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { setIsAuthenticatingAction } from "@/library/redux/actions/session-actions";
import { SESSION_AUTHENTICATED, SESSION_IS_AUTHENTICATING, SESSION_SHOW_LOGIN_MODAL, SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionService } from "@/library/services/session/SessionService";
import { use, useContext, useEffect } from "react";
import { connect } from "react-redux";

export type SessionLayoutProps = {
    children: React.ReactNode;
    session: any;
}
function SessionLayout({
    children,
    session
}: SessionLayoutProps) {

    const modalContext = useContext(AppModalContext);
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
        if (!session[SESSION_AUTHENTICATED] && session[SESSION_SHOW_LOGIN_MODAL]) {
            modalContext.show({
                title: 'Login',
                component: (
                    <LoginBlock />
                ),
                // onOk: async () => {
                //     if (!item?.id || item?.id === '') {
                //         throw new Error('Page ID is required');
                //     }
                //     const response = await TruJobApiMiddleware.getInstance().resourceRequest({
                //         endpoint: `${truJobApiConfig.endpoints.page}/${item.id}`,
                //         method: ApiMiddleware.METHOD.DELETE,
                //         protectedReq: true
                //     })
                //     if (!response) {
                //         return;
                //     }
                // },
                show: true,
                showFooter: false
            }, 'login-modal');
        }
        authViewRequest();
    }, [session[SESSION_IS_AUTHENTICATING]]);

    return children;
}
export default connect(
    (state: any) => ({
        session: state[SESSION_STATE]
    })
)(SessionLayout);