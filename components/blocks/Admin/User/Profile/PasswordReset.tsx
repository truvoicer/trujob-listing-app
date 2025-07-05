import { UrlHelpers } from "@/helpers/UrlHelpers";
import { ErrorItem } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { RootState } from "@/library/redux/store";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";

export type PasswordResetProps = {
  trigger?: (handlePasswordReset: () => Promise<void>) => React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: ErrorItem) => void;
  session?: SessionState;
  email?: string | null;
};
export async function passwordResetRequest(email: string | null = null) {
  return await TruJobApiMiddleware.getInstance().resourceRequest({
    endpoint: UrlHelpers.urlFromArray([
      TruJobApiMiddleware.getConfig().endpoints.auth.password.reset.request,
    ]),
    method: TruJobApiMiddleware.METHOD.POST,
    protectedReq: false,
    data: {
      email,
    },
  });
}

function PasswordReset({
  email,
  trigger,
  onSuccess,
  onError,
}: PasswordResetProps) {
  async function handlePasswordReset(email: string | null = null) {
    const response = await passwordResetRequest(email);
    if (!response) {
      if (typeof onError === "function") {
        onError({
          code: "password-reset-failed",
          message: "Failed to reset password. No response received.",
          data: {},
        });
      }
      return;
    }
    if (typeof onSuccess === "function") {
      onSuccess();
    }
  }
  return (
    <>
      {typeof trigger === "function" ? (
        trigger(handlePasswordReset)
      ) : (
        <Button variant="secondary" type="button" onClick={handlePasswordReset(email)}>
          Reset Password
        </Button>
      )}
    </>
  );
}

export default connect(
  (state: RootState) => ({
    session: state[SESSION_STATE],
  }),
  null
)(PasswordReset);
