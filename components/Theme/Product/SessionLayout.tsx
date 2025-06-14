import LoginBlock from "@/components/blocks/Auth/LoginBlock";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { AppModalContext } from "@/contexts/AppModalContext";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { setIsAuthenticatingAction } from "@/library/redux/actions/session-actions";
import {
  SESSION_AUTHENTICATED,
  SESSION_IS_AUTHENTICATING,
  SESSION_SHOW_LOGIN_MODAL,
  SESSION_STATE,
} from "@/library/redux/constants/session-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { RootState } from "@/library/redux/store";
import { SessionService } from "@/library/services/session/SessionService";
import { useContext, useEffect } from "react";
import { connect } from "react-redux";

export type SessionLayoutProps = {
  children: React.ReactNode;
  session: SessionState;
};
function SessionLayout({ children, session }: SessionLayoutProps) {
  const modalContext = useContext(AppModalContext);
  const sessionIsAuthenticating = session[SESSION_IS_AUTHENTICATING];
  const sessionAuthenticated = session[SESSION_AUTHENTICATED];
  const sessionShowLoginModal = session[SESSION_SHOW_LOGIN_MODAL];

  async function authViewRequest() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: `${truJobApiConfig.endpoints.auth.view}`,
      method: ApiMiddleware.METHOD.GET,
      protectedReq: true,
    });

    if (!response) {
      setIsAuthenticatingAction(false);
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
  function handleUnauthenticatedSession() {
    if (sessionIsAuthenticating) {
      authViewRequest();
      return;
    }
    if (!sessionAuthenticated) {
      if (sessionShowLoginModal) {
        modalContext.show(
          {
            title: "Login",
            component: <LoginBlock
              onSuccess={(data) => {
                console.log("Login successful:", data);
                modalContext.hide("login-modal");
              }}
              onError={(error) => {
                console.error("Login failed:", error);
              }}
            />,
            show: true,
            showFooter: false,
          },
          "login-modal"
        );
        return;
      }
    }
  }
  useEffect(() => {
    handleUnauthenticatedSession();
  }, [sessionAuthenticated, sessionIsAuthenticating, sessionShowLoginModal]);

    console.log('s', {
      sessionAuthenticated,
      sessionIsAuthenticating,
      sessionShowLoginModal,
    })
  return children;
}
export default connect((state: RootState) => ({
  session: state[SESSION_STATE],
}))(SessionLayout);
