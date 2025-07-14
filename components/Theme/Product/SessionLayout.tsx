import LoginBlock from "@/components/blocks/Auth/LoginBlock";
import Form from "@/components/form/Form";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { AppModalContext } from "@/contexts/AppModalContext";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import {
  closeSessionModalAction,
  setIsAuthenticatingAction,
} from "@/library/redux/actions/session-actions";
import {
  SESSION_AUTHENTICATED,
  SESSION_IS_AUTHENTICATING,
  SESSION_MODAL_COMPONENT,
  SESSION_MODAL_ID,
  SESSION_MODAL_ON_CANCEL,
  SESSION_MODAL_ON_CLOSE,
  SESSION_MODAL_ON_OK,
  SESSION_MODAL_PREVENT_CLOSE,
  SESSION_MODAL_SHOW,
  SESSION_MODAL_SHOW_CLOSE_BUTTON,
  SESSION_MODAL_SHOW_FOOTER,
  SESSION_MODAL_TITLE,
  SESSION_MODALS,
  SESSION_SHOW_LOGIN_MODAL,
  SESSION_STATE,
} from "@/library/redux/constants/session-constants";
import {
  closeSessionModal,
  SessionModalItem,
  SessionState,
} from "@/library/redux/reducers/session-reducer";
import { RootState } from "@/library/redux/store";
import { ThemeService } from "@/library/services/app/ThemeService";
import { SessionService } from "@/library/services/session/SessionService";
import { FormikProps, FormikValues } from "formik";
import { useContext, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
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
            component: (
              <LoginBlock
                onSuccess={(data) => {
                  console.log("Login successful:", data);
                  modalContext.hide("login-modal");
                }}
                onError={(error) => {
                  console.error("Login failed:", error);
                }}
              />
            ),
            show: true,
            showFooter: false,
          },
          "login-modal"
        );
        return;
      }
    }
  }

  function renderModalComponents(
    modal: SessionModalItem,
    config?: Record<string, unknown>,
    formikProps?: FormikProps<FormikValues>
  ) {
    return (
      <>
        {modal?.[SESSION_MODAL_TITLE] && (
          <Modal.Header
            closeButton={modal?.[SESSION_MODAL_SHOW_CLOSE_BUTTON] ?? true}
          >
            <Modal.Title>{modal[SESSION_MODAL_TITLE]}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>
          {(() => {
            const CompOrNode = ThemeService.findThemeComponent(
              modal?.[SESSION_MODAL_COMPONENT]
            );
            if (
              typeof CompOrNode === "function" ||
              (typeof CompOrNode === "object" &&
                CompOrNode &&
                "prototype" in CompOrNode)
            ) {
              const Comp = CompOrNode as React.ComponentType<any>;
              return <Comp />;
            }
            return CompOrNode;
          })()}
        </Modal.Body>
        {modal?.[SESSION_MODAL_SHOW_FOOTER] && (
          <Modal.Footer>
            <Button
              className="btn btn-secondary"
              onClick={() => {
                if (typeof modal?.[SESSION_MODAL_ON_CANCEL] === "function") {
                  modal?.[SESSION_MODAL_ON_CANCEL]();
                  return;
                }
                if (modal?.[SESSION_MODAL_PREVENT_CLOSE] === true) {
                  return;
                }
                closeSessionModalAction(modal[SESSION_MODAL_ID]);
              }}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-secondary"
              type={
                typeof config?.formProps?.onSubmit === "function"
                  ? "submit"
                  : "button"
              }
              onClick={async () => {
                if (typeof config?.formProps?.onSubmit === "function") {
                  return;
                }
                if (typeof modal?.[SESSION_MODAL_ON_OK] === "function") {
                  modal?.[SESSION_MODAL_ON_OK]();
                }
                if (modal?.[SESSION_MODAL_PREVENT_CLOSE] === true) {
                  return;
                }
                closeSessionModal(modal[SESSION_MODAL_ID]);
              }}
            >
              Ok
            </Button>
          </Modal.Footer>
        )}
      </>
    );
  }
  useEffect(() => {
    handleUnauthenticatedSession();
  }, [sessionAuthenticated, sessionIsAuthenticating, sessionShowLoginModal]);

  return (
    <>
      {children}
      {session[SESSION_MODALS].map((modal: SessionModalItem, index: number) => {
        const config = ThemeService.findThemeComponentConfig(
          modal?.[SESSION_MODAL_COMPONENT]
        );
        if (!config) {
          console.warn(
            `No config found for modal component: ${modal?.[SESSION_MODAL_COMPONENT]}`
          );
          return null;
        }
        const { onSubmit, ...otherProps } = config?.formProps;
        return (
          <Modal
            key={index}
            show={modal?.[SESSION_MODAL_SHOW] === true}
            onHide={() => {
              if (typeof modal?.[SESSION_MODAL_ON_CLOSE] === "function") {
                modal?.[SESSION_MODAL_ON_CLOSE]();
              }
              closeSessionModalAction(modal[SESSION_MODAL_ID]);
            }}
            backdrop={
              modal?.[SESSION_MODAL_PREVENT_CLOSE] === true ? "static" : true
            }
          >
            {config?.formProps ? (
              <Form
                {...otherProps}
                onSubmit={async (values) => {
                  if (typeof onSubmit === "function") {
                    const result = await onSubmit(values, modal);
                    if (!result) {
                      return false;
                    }
                    if (typeof modal?.[SESSION_MODAL_ON_OK] === "function") {
                      modal?.[SESSION_MODAL_ON_OK]();
                    }
                    return true;
                  }
                }}
              >
                {(formikProps: FormikProps<FormikValues>) =>
                  renderModalComponents(modal, config, formikProps)
                }
              </Form>
            ) : (
              renderModalComponents(modal)
            )}
          </Modal>
        );
      })}
    </>
  );
}
export default connect((state: RootState) => ({
  session: state[SESSION_STATE],
}))(SessionLayout);
