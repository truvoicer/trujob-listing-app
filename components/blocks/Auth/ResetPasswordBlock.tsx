import TextInput from "@/components/Elements/TextInput";
import Form, {
  VALIDATION_ALPHA_NUMERIC_SYMBOLS,
  VALIDATION_EMAIL,
  VALIDATION_MATCH,
  VALIDATION_REQUIRED,
} from "@/components/form/Form";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { ApiMiddleware } from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { RootState } from "@/library/redux/store";
import { SessionService } from "@/library/services/session/SessionService";
import { FormikProps, FormikValues } from "formik";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
const RESET_STATUS_SUCCESS = "RESET_STATUS_SUCCESS";
const RESET_STATUS_FAILURE = "RESET_STATUS_FAILURE";
const RESET_STATUS_TOKEN_CHECKING = "RESET_STATUS_TOKEN_CHECKING";
const RESET_STATUS_TOKEN_INVALID = "RESET_STATUS_TOKEN_INVALID";
const RESET_STATUS_TOKEN_VALID = "RESET_STATUS_TOKEN_VALID";

export type ResetPasswordBlockProps = {
  session: SessionState;
};
function ResetPasswordBlock() {
  const [resetStatus, setResetStatus] = useState<
    | typeof RESET_STATUS_SUCCESS
    | typeof RESET_STATUS_FAILURE
    | typeof RESET_STATUS_TOKEN_CHECKING
    | typeof RESET_STATUS_TOKEN_INVALID
    | typeof RESET_STATUS_TOKEN_VALID
  >(RESET_STATUS_TOKEN_CHECKING);

  const searchParams = useSearchParams();

  async function formSubmitHandler(values: FormikValues) {
    const requestData = {
      password: values.password,
      password_confirmation: values.password_confirmation,
      token: searchParams.get("token") || "",
    };

    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: `${truJobApiConfig.endpoints.auth.password.reset.confirmation}`,
      method: ApiMiddleware.METHOD.POST,
      data: requestData,
    });

    if (!response) {
      console.error("Password reset failed", response);
      setResetStatus(RESET_STATUS_FAILURE);
      SessionService.logout();
      return;
    }
    setResetStatus(RESET_STATUS_SUCCESS);
    SessionService.logout();
  }
  async function checkTokenValidity() {
    const response = await TruJobApiMiddleware.getInstance().resourceRequest({
      endpoint: `${truJobApiConfig.endpoints.auth.password.reset.tokenCheck}`,
      method: ApiMiddleware.METHOD.POST,
      data: {
        token: searchParams.get("token") || "",
      },
    });
    if (!response) {
      console.error("Token check failed", response);
      setResetStatus(RESET_STATUS_TOKEN_INVALID);
      return;
    }
    setResetStatus(RESET_STATUS_TOKEN_VALID);
  }
  useEffect(() => {
    checkTokenValidity();
  }, []);

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center">
        <div className="col-md-7 mb-5 z-index-1" data-aos="fade">
          <h2 className="mb-5 text-black">Reset Password</h2>
          {resetStatus === RESET_STATUS_TOKEN_VALID && (
            <Form
              className="p-5 bg-white"
              operation="create"
              onSubmit={formSubmitHandler}
              initialValues={{
                email: "",
                password: "",
                password_confirmation: "",
              }}
              validation={{
                email: [
                  { type: VALIDATION_EMAIL },
                  { type: VALIDATION_REQUIRED },
                ],
                password: [
                  { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS },
                  { type: VALIDATION_REQUIRED },
                ],
                password_confirmation: [
                  { type: VALIDATION_ALPHA_NUMERIC_SYMBOLS },
                  { type: VALIDATION_REQUIRED },
                  { type: VALIDATION_MATCH, field: "password" },
                ],
              }}
            >
              {({
                values,
                errors,
                handleChange,
              }: FormikProps<FormikValues>) => {
                return (
                  <>
                    <div className="row form-group">
                      <div className="col-md-12">
                        <TextInput
                          name="email"
                          label="Email"
                          type="email"
                          placeholder="Enter your email"
                          value={values.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                      <div className="col-md-12">
                        <TextInput
                          name="password"
                          label="New Password"
                          type="password"
                          placeholder="Enter your new password"
                          value={values.password}
                          onChange={handleChange}
                        />
                        {errors.password && (
                          <div className="text-danger">{errors.password}</div>
                        )}
                      </div>
                      <div className="col-md-12">
                        <TextInput
                          name="password_confirmation"
                          label="Confirm New Password"
                          type="password"
                          placeholder="Confirm your new password"
                          value={values.password_confirmation}
                          onChange={handleChange}
                        />
                        {errors.password_confirmation && (
                          <div className="text-danger">
                            {errors.password_confirmation}
                          </div>
                        )}
                      </div>
                      <div className="col-md-12">
                        <Button variant="primary" type="submit">
                          Reset Password
                        </Button>
                      </div>
                    </div>
                  </>
                );
              }}
            </Form>
          )}
          {resetStatus === RESET_STATUS_TOKEN_INVALID && (
            <div className="alert alert-danger">
              Invalid or expired token. Please request a new password reset.
            </div>
          )}
          {resetStatus === RESET_STATUS_TOKEN_CHECKING && (
            <div className="alert alert-info">Checking token validity...</div>
          )}
          {resetStatus === RESET_STATUS_SUCCESS && (
            <div className="alert alert-success">
              Your password has been reset successfully. Please log in with your
              new password.
              <Link href="/login" className="btn btn-link">
                Go to Login
              </Link>
            </div>
          )}
          {resetStatus === RESET_STATUS_FAILURE && (
            <div className="alert alert-danger">
              There was an error resetting your password. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default connect((state: RootState) => ({
  session: state[SESSION_STATE],
}))(ResetPasswordBlock);
