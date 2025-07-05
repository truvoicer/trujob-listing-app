import Form, {
  VALIDATION_EMAIL,
  VALIDATION_REQUIRED,
} from "@/components/form/Form";
import { SESSION_STATE } from "@/library/redux/constants/session-constants";
import { SessionState } from "@/library/redux/reducers/session-reducer";
import { RootState } from "@/library/redux/store";
import { FormikProps, FormikValues } from "formik";
import { useContext } from "react";
import { connect } from "react-redux";
import {
  passwordResetRequest,
} from "../Admin/User/Profile/PasswordReset";
import { AppNotificationContext } from "@/contexts/AppNotificationContext";
import Link from "next/link";

export type PasswordResetBlockProps = {
  session: SessionState;
};
function PasswordResetBlock({}: PasswordResetBlockProps) {
  const notificationContext = useContext(AppNotificationContext);
  async function formSubmitHandler(values: FormikValues) {

    const response = await passwordResetRequest(values?.email);

    if (response) {
      notificationContext.show({
        variant: "success",
        title: "Password Reset",
        message: "Password reset email sent successfully.",
      }, 'password-reset-success');
    } else {
      notificationContext.show({
        variant: "danger",
        title: "Password Reset Failed",
        message: "Failed to send password reset email. Please try again.",
      }, 'password-reset-failure');
    }
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
            }}
            validation={{
              email: [
                { type: VALIDATION_EMAIL },
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
              isSubmitting,
            }: FormikProps<FormikValues>) => {
              return (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <h2 className="text-black">Reset Password</h2>
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
                    <div className="col-12">
                      <span className="text-black text-center w-100 d-block">
                        No account yet? <Link href="/register">Register</Link>
                      </span>
                    </div>
                    <div className="col-12">
                      <span className="text-black text-center w-100 d-block">
                        Already have an account? <Link href="/login">Login</Link>
                      </span>
                    </div>
                  </div>

                  <div className="row form-group">
                    <div className="col-md-12">
                      <input
                        disabled={isSubmitting}
                        type="submit"
                        value="Reset Password"
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
}))(PasswordResetBlock);
