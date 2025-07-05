import Form, {
  VALIDATION_ALPHA_NUMERIC_SYMBOLS,
  VALIDATION_EMAIL,
  VALIDATION_REQUIRED,
} from "@/components/form/Form";
import truJobApiConfig from "@/config/api/truJobApiConfig";
import { UrlHelpers } from "@/helpers/UrlHelpers";
import {
  ApiMiddleware,
  ErrorItem,
} from "@/library/middleware/api/ApiMiddleware";
import { TruJobApiMiddleware } from "@/library/middleware/api/TruJobApiMiddleware";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
// import RootState from your Redux store definition
import { RootState } from "@/library/redux/store";
import { FormikProps, FormikValues } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Variant } from "react-bootstrap/esm/types";
import { connect } from "react-redux";

export type LoginFormValues = {
  email: string;
  password: string;
  auth_provider?: string;
};
export type LoginBlockProps = {
  session: SessionState;
  onSuccess?: (data: any) => void;
  onError?: (error: ErrorItem) => void;
};
function LoginBlock({ session, onSuccess, onError }: LoginBlockProps) {
  const [alert, setAlert] = useState<{
    variant: Variant;
    messages: string[];
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const truJobApiMiddleware = TruJobApiMiddleware.getInstance().setDisableLoginModal(true);

  async function formSubmitHandler(values: FormikValues) {
    const requestData: LoginFormValues = { ...values } as LoginFormValues;
    requestData.auth_provider = "local";

    const response = await truJobApiMiddleware.resourceRequest({
      endpoint: `${truJobApiConfig.endpoints.auth.login}`,
      method: ApiMiddleware.METHOD.POST,
      data: requestData,
    });

    if (!await truJobApiMiddleware.handleTokenResponse(response)) {
      if (typeof onError === "function") {
        onError({
          requestData,
          response,
        });
      }
      const errors = truJobApiMiddleware.errors.map((error) => error.message || "An error occurred");
      setAlert({
        variant: "danger",
        messages: Array.isArray(errors) ? errors : ['An error occurred during login. Please try again.'],
      });
      return;
    }
    if (typeof onSuccess === "function") {
      onSuccess(response?.data);
      return;
    }
    router.push(UrlHelpers.getRedirectUrl(searchParams, "/"));
  }

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center">
        <div className="col-md-7 mb-5 z-index-1" data-aos="fade">
          <Form
            className="p-5 bg-white"
            operation="create"
            onSubmit={formSubmitHandler}
            initialValues={{
              email: "",
              password: "",
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
            }}
          >
            {({
              values,
              errors,
              handleChange,
              handleBlur,
              submitForm,
              isSubmitting
            }: FormikProps<FormikValues>) => {
              return (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <h2 className="text-black">Log In</h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      {alert && (
                        <div
                          className={`mt-3 alert alert-${alert.variant}`}
                          role="alert"
                            >
                            {Array.isArray(alert?.messages) && alert.messages.map((message, index) => (
                              <div key={index}>{message}</div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row form-group mt-2">
                    <div className="col-md-12">
                      <label className="text-black" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={values?.email || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors?.email && (
                        <span className="text-danger">
                          {errors?.email || ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="row form-group">
                    <div className="col-md-12">
                      <label className="text-black" htmlFor="password">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        value={values?.password || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors?.password && (
                        <span className="text-danger">
                          {errors?.password || ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="row form-group">
                    <div className="col-12">
                      <span className="text-black text-center w-100 d-block">
                        No account yet? <Link href="/register">Register</Link>
                      </span>
                    </div>
                    <div className="col-12">
                      <span className="text-black text-center w-100 d-block">
                        <Link href="/reset-password">Forgot Password?</Link>
                      </span>
                    </div>
                  </div>

                  <div className="row form-group">
                    <div className="col-md-12">
                      <input
                        disabled={isSubmitting}
                        type="submit"
                        value="Sign In"
                        className="btn btn-primary py-2 px-4 text-white btn-block"
                        onClick={(e) => {
                          e.preventDefault();
                          submitForm();
                        }}
                      />
                    </div>
                  </div>
                </>
              );
            }}
          </Form>
        </div>
      </div>
    </div>
  );
}
export default connect((state: RootState) => ({
  session: state[SESSION_STATE],
}))(LoginBlock);
